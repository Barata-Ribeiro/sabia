package com.barataribeiro.sabia.dto.post;

import jakarta.validation.constraints.Size;
import lombok.NonNull;

import java.io.Serializable;

public record PostRequestDTO(@NonNull @Size(max = 280) String text) implements Serializable {
}
