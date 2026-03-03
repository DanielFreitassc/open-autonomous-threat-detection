package com.danielfreitassc.backend.mappers.user;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.danielfreitassc.backend.dtos.user.UserRequestDto;
import com.danielfreitassc.backend.dtos.user.UserResponseDto;
import com.danielfreitassc.backend.models.user.UserEntity;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "lockoutExpiration", ignore = true)
    @Mapping(target = "loginAttempts", ignore = true)
    @Mapping(target = "authorities", ignore = true)
    @Mapping(target = "role", ignore = true)
    UserEntity toEntity(UserRequestDto userRequestDto);
    UserResponseDto toDto(UserEntity userEntity);
}