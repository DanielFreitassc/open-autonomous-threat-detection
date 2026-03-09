package com.danielfreitassc.backend.mappers.module;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.danielfreitassc.backend.dtos.module.ModuleRequestDto;
import com.danielfreitassc.backend.dtos.module.ModuleResponseDto;
import com.danielfreitassc.backend.models.module.ModuleEntity;

@Mapper(componentModel = "spring")
public interface ModuleMapper {
    ModuleResponseDto entityToDto(ModuleEntity moduleEntity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    ModuleEntity dtoToEntity(ModuleRequestDto moduleRequestDto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void toUpdate(ModuleRequestDto moduleRequestDto, @MappingTarget ModuleEntity moduleEntity);
}
