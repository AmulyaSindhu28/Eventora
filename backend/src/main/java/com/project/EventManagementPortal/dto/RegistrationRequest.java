
package com.project.EventManagementPortal.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationRequest {

    @NotNull(message = "Event ID is required")
    @Min(value = 1, message = "Event ID must be valid")
    private Long eventId;
}
