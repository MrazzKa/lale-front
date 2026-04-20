import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateMeasurementDto } from "./dto/measurement.dto";
import { CreateWaterBodyDto, UpdateWaterBodyDto } from "./dto/water-body.dto";

@Injectable()
export class WaterBodiesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.waterBody.findMany({
      include: {
        passport: true,
        measurements: true,
      },
    });
  }

  async findOne(id: string) {
    const waterBody = await this.prisma.waterBody.findUnique({
      where: { id },
      include: {
        passport: true,
        measurements: {
          orderBy: { recordDate: "desc" },
        },
      },
    });

    if (!waterBody) {
      throw new NotFoundException(`Water body with id ${id} not found`);
    }

    return waterBody;
  }

  async create(data: CreateWaterBodyDto) {
    const { passport, ...waterBodyData } = data;

    return this.prisma.waterBody.create({
      data: {
        ...waterBodyData,
        passport: passport ? { create: passport } : undefined,
      },
      include: {
        passport: true,
        measurements: true,
      },
    });
  }

  async update(id: string, data: UpdateWaterBodyDto) {
    const { passport, ...waterBodyData } = data;

    return this.prisma.waterBody.update({
      where: { id },
      data: {
        ...waterBodyData,
        passport: passport
          ? {
              upsert: {
                create: passport,
                update: passport,
              },
            }
          : undefined,
      },
      include: {
        passport: true,
        measurements: true,
      },
    });
  }

  async remove(id: string) {
    return this.prisma.waterBody.delete({
      where: { id },
    });
  }

  async addMeasurement(waterBodyId: string, data: CreateMeasurementDto) {
    const waterBody = await this.prisma.waterBody.findUnique({
      where: { id: waterBodyId },
    });

    if (!waterBody) {
      throw new NotFoundException(`Water body with id ${waterBodyId} not found`);
    }

    return this.prisma.bioindicationRecord.create({
      data: {
        ...data,
        recordDate: data.recordDate ? new Date(data.recordDate) : undefined,
        waterBodyId,
      },
    });
  }

  async getMeasurements(waterBodyId: string) {
    return this.prisma.bioindicationRecord.findMany({
      where: { waterBodyId },
      orderBy: { recordDate: "desc" },
    });
  }

  async updateMeasurement(
    waterBodyId: string,
    measurementId: string,
    data: CreateMeasurementDto,
  ) {
    const measurement = await this.prisma.bioindicationRecord.findFirst({
      where: {
        id: measurementId,
        waterBodyId,
      },
    });

    if (!measurement) {
      throw new NotFoundException(`Measurement with id ${measurementId} not found`);
    }

    return this.prisma.bioindicationRecord.update({
      where: { id: measurementId },
      data: {
        ...data,
        recordDate: data.recordDate ? new Date(data.recordDate) : undefined,
      },
    });
  }

  async removeMeasurement(waterBodyId: string, measurementId: string) {
    const measurement = await this.prisma.bioindicationRecord.findFirst({
      where: {
        id: measurementId,
        waterBodyId,
      },
    });

    if (!measurement) {
      throw new NotFoundException(`Measurement with id ${measurementId} not found`);
    }

    return this.prisma.bioindicationRecord.delete({
      where: { id: measurementId },
    });
  }
}