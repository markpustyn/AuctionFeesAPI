import { Controller, Get, Param, Query, Post, Body, Put } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';


@Controller('fees')
export class FeesController {

    @Post()
    create(@Body() CreateProfileDto: CreateProfileDto) {
        return {
            bidAmount: CreateProfileDto.bidAmount,
            auction: CreateProfileDto.auction
        }
    };
}    
