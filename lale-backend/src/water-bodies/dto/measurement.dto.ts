import { IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateMeasurementDto {
  @IsOptional()
  @IsDateString()
  recordDate?: string;

  @IsOptional() @IsNumber()
  ph?: number;

  @IsOptional() @IsNumber()
  turbidity?: number;

  @IsOptional() @IsString()
  dissolvedGases?: string;

  @IsOptional() @IsString()
  biogenicCompounds?: string;

  @IsOptional() @IsNumber()
  permanganateOxid?: number;

  @IsOptional() @IsNumber()
  mineralization?: number;

  @IsOptional() @IsNumber()
  salinity?: number;

  @IsOptional() @IsNumber()
  hardness?: number;

  @IsOptional() @IsNumber()
  calcium?: number;

  @IsOptional() @IsNumber()
  magnesium?: number;

  @IsOptional() @IsNumber()
  chlorides?: number;

  @IsOptional() @IsNumber()
  sulfates?: number;

  @IsOptional() @IsNumber()
  hydrocarbonates?: number;

  @IsOptional() @IsNumber()
  potassiumSodium?: number;

  @IsOptional() @IsNumber()
  overgrowthPercent?: number;

  @IsOptional() @IsString()
  overgrowthDegree?: string;

  @IsOptional() @IsString()
  phytoplanktonDev?: string;

  @IsOptional() @IsString()
  zooplanktonTaxa?: string;

  @IsOptional() @IsString()
  zooplanktonGroups?: string;

  @IsOptional() @IsString()
  zoobenthosTaxa?: string;

  @IsOptional() @IsString()
  zoobenthosGroups?: string;

  @IsOptional() @IsString()
  trophicStatus?: string;
}