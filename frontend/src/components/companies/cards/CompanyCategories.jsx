import React, {useState} from 'react';
import {Autocomplete, Card, CardActions, CardContent, Divider, IconButton, Typography} from "@mui/joy";
import {useCategories} from "../../../data/CategoriesData";
import Button from "@mui/joy/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import {COMPANY_MODIFICATION} from "../../../utils/AccessRightsList";
import {useAccessRightsHelper} from "../../../utils/AccessRightsHelper";
import CategoryDialog from "../../categories/CategoryDialog";
import PropTypes from "prop-types";

const CompanyCategories = ({
                               categoriesList,
                               setCategories,
                               updateCategories,
                               updateCategoriesLoading,
                               allowAdding = false,
                               dialog = false,
                               deleted = false
                           }) => {

    const {hasRight} = useAccessRightsHelper();
    const canModify = hasRight(COMPANY_MODIFICATION) && !deleted;
    const [open, setOpen] = useState(false)
    const {addCategory, reloadData, categories, loading} = useCategories(true);

    const isOptionEqualToValue = (option) => {
        return option.id === "choose";
    }

    const removeCategory = (categories, id) => {
        return categories.filter(categoryLocal => categoryLocal.id !== id)
    }

    const renderCategory = (category) => {
        return <div key={category.id} style={{display: "flex", justifyContent: "space-between"}}>
            <Typography key={category.id}>• {category.name}</Typography>
            {canModify && <IconButton onClick={() => {
                setCategories(old => removeCategory(old, category.id))
            }}><DeleteIcon/></IconButton>}
        </div>
    }

    return (
        <Card sx={{flex: 1, minWidth: 200}}>
            <CardContent sx={{flex: 0}}>
                <Typography>Kategorie</Typography>
            </CardContent>
            <Divider/>
            <CardContent>
                {categoriesList?.map(category => renderCategory(category))}
                {categoriesList && categoriesList.length === 0 &&
                    <Typography style={{alignSelf: "center"}}>Brak branż</Typography>}
            </CardContent>
            <Divider/>
            <CardActions sx={{flexWrap: "wrap", maxWidth: dialog ? 200 : -1}} buttonFlex={"1"}>
                <Autocomplete
                    disabled={!canModify}
                    loading={loading}
                    disableClearable
                    placeholder="Wybierz"
                    getOptionDisabled={(option) => {
                        return option.id === "choose"
                    }}
                    isOptionEqualToValue={isOptionEqualToValue}
                    options={categories && categoriesList ? categories
                        .filter(category => !categoriesList.map(localCategory => localCategory.id).includes(category.id))
                        .map(category => {
                            return {
                                label: category.name,
                                id: category.id
                            }
                        }) : []}
                    onChange={(e, inputValue) => {
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
                {updateCategories && canModify &&
                    <Button onClick={() => updateCategories(categoriesList)} loading={updateCategoriesLoading}>
                        Zapisz
                    </Button>}
            </CardActions>
            <CardActions>
                {allowAdding && <Button variant={"outlined"} color={"neutral"}
                                        onClick={() => setOpen(true)}>
                    Dodaj
                </Button>}
            </CardActions>
            <CategoryDialog open={open} close={() => {
                reloadData();
                setOpen(false)
            }}
                            addCategory={addCategory}/>
        </Card>
    );
};

CompanyCategories.propTypes = {
    categoriesList: PropTypes.array.isRequired,
    setCategories: PropTypes.func.isRequired,
    updateCategories: PropTypes.func,
    updateCategoriesLoading: PropTypes.bool,
    allowAdding: PropTypes.bool,
    deleted: PropTypes.bool,
    dialog: PropTypes.bool,
}

export default CompanyCategories;