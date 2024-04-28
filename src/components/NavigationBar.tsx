import { useCallback, useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import PokemonListPage from './PokemonListPage';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { getPokemonByType, getPokemonTypes, setPokemon } from '../store/actionCreators';
import { callAPIInterface } from '../utils/constants';
import { allLabel, appLabel, pokemonTypesLabel } from '../utils/messages';

const drawerWidth = 240;

interface IQueryParams {
    limit: number, offset: number
}
export default function NavigationBar() {
    const dispatch: Dispatch<any> = useDispatch()

    const [mobileOpen, setMobileOpen] = useState<boolean>(false);
    const [isClosing, setIsClosing] = useState<boolean>(false);
    const [selectedType, setSelectedType] = useState<string>("all");
    const [queryParams, setQueryParams] = useState<IQueryParams>({ limit: 20, offset: 0 });
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [data, setData] = useState<IPokemon[]>([])

    const pokemonTypes: readonly IPokemon[] = useSelector(
        (state: PokemonState) => state.pokemonTypes,
        shallowEqual
    )

    const pokemons: IPokemon[] = useSelector(
        (state: PokemonState) => state.pokemons,
        shallowEqual
    )

    useEffect(() => {
        setData(pokemons)
    }, [pokemons])

    const getPokemon = (list: IPokemon[], queryParams: IQueryParams) => {
        callAPIInterface({
            method: "GET",
            path: `/pokemon?limit=${queryParams.limit}&offset=${queryParams.offset}`,
        }).then((res: any) => {
            const results: IPokemon[] = res.results;
            if (res.count <= data.length) setHasMore(false)
            else setQueryParams((prevProps) => ({ limit: 20, offset: prevProps.offset + 1 }))
            dispatch(setPokemon(list.concat(results)))
        });
    }

    const abortController = new AbortController();
    const { signal } = abortController;

    useEffect(() => {
        getPokemon([], queryParams)
        dispatch(getPokemonTypes())
        return () => abortController.abort();
    }, [])


    const loadMore = useCallback(() => {
        getPokemon(data, queryParams);
    }, [data]);

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    const drawerListTitle = (title: string) => {
        return <ListItemButton>
            <Typography variant='body1'>{title}</Typography>
        </ListItemButton>
    }

    const drawer = (
        <>
            <Toolbar><Typography variant='h5' className='title'>{pokemonTypesLabel}</Typography></Toolbar>
            <Divider />
            <List className='type-list'>
                <ListItem disablePadding selected={selectedType === "all"} onClick={() => {
                    setSelectedType("all")
                    getPokemon([], { limit: 20, offset: 0 });
                }}>{drawerListTitle(allLabel)}</ListItem>
                {pokemonTypes.map((type, index) => {
                    return <ListItem key={index} selected={type.name === selectedType} disablePadding onClick={() => {
                        setSelectedType(type.name)
                        dispatch(getPokemonByType(type.name, signal))
                        handleDrawerClose()
                    }}>{drawerListTitle(type.name)}</ListItem>
                })}
            </List>
        </>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                className='user-home-page'
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        {appLabel}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <PokemonListPage hasMore={hasMore} loadMore={loadMore} pokemons={data} />
        </Box>
    );
}
