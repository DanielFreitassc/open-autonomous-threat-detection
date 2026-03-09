package com.danielfreitassc.backend.services.user;

import org.springframework.stereotype.Service;

import com.danielfreitassc.backend.dtos.user.UserResponseDto;
import com.danielfreitassc.backend.mappers.user.UserMapper;
import com.danielfreitassc.backend.models.user.UserEntity;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthMeService {
    private final UserMapper userMapper;

    public UserResponseDto auth(UserEntity userEntity) {
        return userMapper.toDto(userEntity);
    }
}
