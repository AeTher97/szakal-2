package org.iaeste.szakal2.models.dto.journey;

import lombok.Builder;
import lombok.Data;
import org.iaeste.szakal2.models.dto.user.UserDTO;
import org.iaeste.szakal2.models.entities.Comment;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class CommentDetailsDTO {

    private String comment;
    private LocalDateTime date;
    private UserDTO user;
    private UUID id;

    public static CommentDetailsDTO fromComment(Comment comment) {
        return CommentDetailsDTO.builder()
                .comment(comment.getCommentValue())
                .date(comment.getDate())
                .user(UserDTO.fromUser(comment.getUser()))
                .id(comment.getId())
                .build();
    }
}
