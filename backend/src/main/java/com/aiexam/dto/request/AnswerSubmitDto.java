package com.aiexam.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.AccessLevel;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnswerSubmitDto {
    
    @NotNull(message = "Question ID is required")
    private String questionId;

    private Object answer;
    
    private Integer timeTaken;
    
    @Getter(AccessLevel.NONE)
    @Setter(AccessLevel.NONE)
    @JsonProperty("isSkipped")
    private Boolean isSkipped;

    public Boolean getIsSkipped() {
        return isSkipped;
    }

    public void setIsSkipped(Boolean isSkipped) {
        this.isSkipped = isSkipped;
    }
}