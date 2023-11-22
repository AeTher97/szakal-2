import React, {useRef, useState} from 'react';
import {Autocomplete, Card, CardActions, CardContent, Divider, IconButton, Typography} from "@mui/joy";
import {useCategories} from "../../data/CategoriesData";
import Button from "@mui/joy/Button";
import DeleteIcon from '@mui/icons-material/Delete';

const CompanyCategories = ({categoriesList, setCategories, updateCategories, updateCategoriesLoading}) => {

    const {categories, loading} = useCategories();
    const [value, setValue] = useState("");
    const ref = useRef();

    const isOptionEqualToValue = (option) => {
        return option.id === "choose";
    }


    return (
        <Card>
            <CardContent sx={{flex: 0}}>
                <Typography>Branże</Typography>
            </CardContent>
            <Divider/>
            <CardContent>
                {categoriesList.map(category =>
                    <div key={category.id} style={{display: "flex", justifyContent: "space-between"}}>
                        <Typography key={category.id}>• {category.name}</Typography>
                        <IconButton onClick={() => {
                            setCategories(old => {
                                return old.filter(categoryLocal => categoryLocal.id !== category.id)
                            })
                        }}><DeleteIcon/></IconButton>
                    </div>)}
                {categoriesList.length === 0 &&
                    <Typography style={{alignSelf: "center"}}>Brak branż</Typography>}
            </CardContent>
            <Divider/>
            <CardActions sx={{flexWrap: "wrap"}}>
                <Autocomplete
                    inputValue={value}
                    onInputChange={() => {
                        console.log("input")
                    }}
                    loading={loading}
                    disableClearable
                    isOptionEqualToValue={isOptionEqualToValue}
                    options={categories ? categories
                        .filter(category => !categoriesList.map(localCategory => localCategory.id).includes(category.id))
                        .map(category => {
                            return {
                                label: category.name,
                                id: category.id
                            }
                        }) : [{id: "choose", label: "Wybierz"}]}
                    onChange={(e, inputValue) => {
                        setValue("");
                        setCategories(old => {
                            return [
                                ...old, {
                                    name: inputValue.label,
                                    id: inputValue.id
                                }
                            ]
                        })
                    }}
                />
                {updateCategories &&
                    <Button onClick={() => updateCategories(categoriesList)} loading={updateCategoriesLoading}>
                        Zapisz
                    </Button>}
            </CardActions>


        </Card>
    );
};

export default CompanyCategories;