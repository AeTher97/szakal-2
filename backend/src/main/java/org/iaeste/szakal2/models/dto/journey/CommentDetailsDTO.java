package org.iaeste.szakal2.models.dto.journey;

import lombok.Builder;
import lombok.Data;
import org.iaeste.szakal2.models.entities.Comment;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class CommentDetailsDTO {

    private String comment;
    private LocalDateTime date;
    private ContactJourneyUserDTO user;
    private UUID id;
    private boolean edited;

    public static CommentDetailsDTO fromComment(Comment comment) {
        return CommentDetailsDTO.builder()
                .comment(comment.getCommentValue())
                .date(comment.getDate())
                .user(ContactJourneyUserDTO.fromUser(comment.getUser()))
                .id(comment.getId())
                .edited(comment.isEdited())
                .build();
    }
}
