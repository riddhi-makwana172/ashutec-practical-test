import { memo, useState } from 'react';
import { Box, Divider, Grid, Input, List, ListItem, Tooltip, Typography } from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import ListIcon from '@mui/icons-material/List';
import InfiniteScroll from "react-infinite-scroll-component";
import { loadingLabel, noResultFound, noSearchFound, searchPlaceholder } from '../utils/messages';

interface IProps {
    loadMore: any,
    hasMore: boolean,
    pokemons: IPokemon[]
}

const PokemonListPage = ({ loadMore, hasMore, pokemons }: IProps) => {
    const [isGridView, setIsGridView] = useState<boolean>(true);
    const [filteredData, setFilteredData] = useState<IPokemon[]>([])
    const [value, setValue] = useState<string>("")

    const dataToMap = value !== "" ? filteredData : pokemons

    const gridView = () => {
        return <Grid container columns={{ xs: 3, sm: 3, md: 7 }}>
            {dataToMap.length > 0 && dataToMap.map((item, index) => (
                <Grid className="wrapper-grid" item xs={2} sm={2} md={2} key={index}>
                    <Typography variant='h5'>{item.name}</Typography>
                </Grid>
            ))}
        </Grid>
    }

    const listView = () => {
        return <List sx={{ width: '100%', bgcolor: 'background.paper' }} className='list-view-wrapper'>
            {dataToMap.length > 0 && dataToMap.map((item, index) => (
                <>
                    <ListItem><Typography variant='body1'>{item.name}</Typography></ListItem>
                    {index !== dataToMap.length - 1 && <Divider />}
                </>
            ))}
        </List>
    }

    const handleInputChange = (e: any): void => {
        const inputValue = e.target.value
        setValue(inputValue)
        const results: IPokemon[] = pokemons.filter((item) => item.name.includes(inputValue))
        setFilteredData(results)
    }

    const commonText = (label: string) => {
        return <Typography variant='h5' sx={{ ml: "15px", mt: "15px" }}>{label}</Typography>
    }

    return (
        <Box sx={{ flexGrow: 1, mt: "64px", padding: "30px" }}>
            {!pokemons.length ? commonText(noResultFound) :
                <>
                    <Tooltip title="Grid view" placement="top">
                        <GridViewIcon className='icon-style' onClick={() => setIsGridView(true)} />
                    </Tooltip>
                    <Tooltip title="List view" placement="top">
                        <ListIcon className='icon-style' onClick={() => setIsGridView(false)} />
                    </Tooltip>
                    <Input value={value} className='search-input' type='text' placeholder={searchPlaceholder} onChange={handleInputChange} />
                    {value && filteredData.length === 0 ? commonText(noSearchFound) :
                        <InfiniteScroll
                            dataLength={dataToMap?.length}
                            next={loadMore}
                            hasMore={hasMore}
                            loader={value === "" && commonText(loadingLabel)}
                        >
                            {isGridView ? gridView() : listView()}
                        </InfiniteScroll>}
                </>}
        </Box >
    );
};

export default memo(PokemonListPage);