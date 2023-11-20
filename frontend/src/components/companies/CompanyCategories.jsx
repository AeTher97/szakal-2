import React, {useRef, useState} from 'react';
import {Autocomplete, Card, CardActions, CardContent, Divider, Typography} from "@mui/joy";
import {useCategories} from "../../data/CategoriesData";
import Button from "@mui/joy/Button";

const CompanyCategories = ({localCompany, setLocalCompany}) => {

    const {categories, loading} = useCategories();
    const [value, setValue] = useState("");
    const ref = useRef();

    return (
        <Card>
            <CardContent sx={{flex: 0}}>
                <Typography>Branże</Typography>
            </CardContent>
            <Divider/>
            <CardContent>
                {localCompany.categories.map(category =>
                    <Typography key={category.id}>• {category.name}</Typography>)}
                {localCompany.categories.length === 0 &&
                    <Typography style={{alignSelf: "center"}}>Brak branż</Typography>}
            </CardContent>
            <Divider/>
            <CardActions sx={{flexWrap: "wrap"}}>
                <Autocomplete
                    value={value}
                    loading={loading}
                    disableClearable
                    clearOnBlur
                    options={categories ? categories
                        .filter(category => !localCompany.categories.map(localCategory => localCategory.id).includes(category.id))
                        .map(category => {
                            return {
                                label: category.name,
                                id: category.id
                            }
                        }) : []}
                    onChange={(e, inputValue) => {
                        setValue("");
                        setLocalCompany(old => {
                            return {
                                ...old,
                                categories: [...old.categories, {
                                    name: inputValue.label,
                                    id: inputValue.id
                                }]
                            }
                        })
                    }}
                />
                <Button>Zapisz</Button>
            </CardActions>


        </Card>
    );
};

export default CompanyCategories;