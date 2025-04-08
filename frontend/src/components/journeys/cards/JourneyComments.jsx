import React from 'react';
import {Stack, Typography} from "@mui/joy";
import Button from "@mui/joy/Button";
import {useSelector} from "react-redux";
import {TextAreaWithLimit} from "../../misc/InputWithLimit";
import PropTypes from "prop-types";
import {UseFieldValidation} from "../../../utils/UseFieldValidation";
import Comment from "./Comment";

const JourneyComments = ({addComment, editComment, journey}) => {

    const {userId} = useSelector(state => state.auth)
    const comment = UseFieldValidation();

    const isFormValid = comment.isValid;

    return (
        <div style={{flex: 1}}>
            <Typography level={"h3"}>Komentarze</Typography>
            <form onSubmit={(e) => {
                e.preventDefault();
                if (!isFormValid) {
                    return;
                }
                if (comment.value !== "") {
                    addComment(userId, comment.value);
                }
                comment.reset();
            }}>
                <div style={{display: "flex"}}>
                    <Stack spacing={1} style={{flex: 1}}>
                        <Typography level={"title-lg"}>Dodaj komentarz</Typography>
                        <TextAreaWithLimit minRows={2} required
                                           value={comment.value}
                                           limit={comment.limit}
                                           isValid={comment.isValid}
                                           onChange={comment.handleChange}
                                           placeholder={"Komentarz"}
                        />
                        <Button type={"submit"} disabled={!isFormValid}>Dodaj</Button>
                    </Stack>
                </div>
            </form>
            <div data-testid="cypress-journey-comments">
                {journey.comments.sort((a, b) => {
                    return new Date(a.date) > new Date(b.date) ? -1 : 1;
                }).map(comment => {
                    return (
                        <Comment
                            key={comment.id}
                            editComment={editComment}
                            comment={comment}
                            userId={userId}
                        />
                    )
                })}
            </div>
            {journey.comments.length === 0 &&
                <div style={{padding: 10, display: "flex", justifyContent: "center"}}>
                    <Typography>Brak komentarzy</Typography>
                </div>}
        </div>
    );
};

JourneyComments.propTypes = {
    addComment: PropTypes.func.isRequired,
    editComment: PropTypes.func.isRequired,
    journey: PropTypes.object.isRequired
}

export default JourneyComments;