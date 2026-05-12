package com.danielfreitassc.backend.mappers.whitelist;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import com.danielfreitassc.backend.dtos.whitelist.WhitelistRequestDto;
import com.danielfreitassc.backend.dtos.whitelist.WhitelistResponseDto;
import com.danielfreitassc.backend.models.whitelist.WhitelistEntity;

@Mapper(componentModel = "spring")
public interface WhitelistMapper {
    WhitelistResponseDto toDto(WhitelistEntity whitelistEntity);

    WhitelistEntity toEntity(WhitelistRequestDto whitelistRequestDto);
    
    void toUpdate(WhitelistRequestDto whitelistRequestDto,@MappingTarget WhitelistEntity whitelistEntity);
}
