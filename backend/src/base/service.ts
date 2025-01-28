import { Model, HydratedDocument } from 'mongoose';
import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { readFile } from 'fs/promises';

@Injectable()
export class Service<TEntity extends { id_user: string }> {
    constructor(protected readonly model: Model<HydratedDocument<TEntity>>) { }

    /**
     * Creates a new entity
     * @param createDto The DTO containing entity data
     * @param userId The user ID who owns this entity
     */
    async create<TCreateDto>(
        createDto: TCreateDto,
        userId: string,
        ...args: any[]
    ): Promise<TEntity> {
        try {
            const entity = await this.model.create({
                ...createDto,
                id_user: userId,
            });

            return entity.toJSON() as TEntity;
        } catch (error) {
            throw new Error(`Failed to create entity: ${error.message}`);
        }
    }

    /**
     * Retrieves all entities owned by the user
     * @param userId The user ID
     */
    async getAll<TGetDto>(userId: string): Promise<TGetDto[]> {
        const entities = await this.model.find({ id_user: userId }).exec();

        return entities.map((entity) => entity.toJSON() as TGetDto);
    }

    /**
     * Updates an existing entity by its ID
     * @param id The ID of the entity to update
     * @param updateDto The DTO containing the updated data
     * @returns The updated entity
     * @throws Will throw an error if the entity is not found or the update fails
     */
    async update<TUpdateDTO>(
        id: string,
        updateDto: TUpdateDTO,
    ): Promise<TEntity> {
        try {
            const updatedEntity = await this.model.findByIdAndUpdate(
                id,
                updateDto,
                { new: true },
            );

            if (!updatedEntity) {
                throw new Error('Entity not found');
            }

            return updatedEntity.toJSON() as TEntity;
        } catch (error) {
            throw new Error(`Failed to update entity: ${error.message}`);
        }
    }

    /**
     * Deletes an entity by its ID if it belongs to the specified user
     * @param id The ID of the entity to delete
     * @param userId The user ID who owns this entity
     * @throws Will throw an error if the entity is not found or the user does not own the entity
     */
    async delete(id: string, userId: string): Promise<void> {
        try {
            const findEntry = await this.model.findById(id);

            if (!findEntry) {
                throw new NotFoundException(`Entry with ID ${id} not found`);
            }

            if (findEntry.id_user !== userId) {
                throw new BadRequestException(
                    'This entry was not created by you!',
                );
            }

            await this.model.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(`Failed to delete entry: ${error.message}`);
        }
    }

    /**
     * Initializes the collection with data from a file if the collection is empty.
     *
     * @param filename The name of the file containing the initial data.
     * @param filterString The field name to filter and check for existing entities.
     * @throws Will throw an error if reading the file or inserting the document fails.
     */
    async initializeIfEmpty(path: string, filterString: string[]) {
        try {
            const data = await readFile(path, 'utf8');
            let filter = {};
            const jsonData: TEntity[] = JSON.parse(data);
            for (const entity of jsonData) {
                filter = {};

                filterString.forEach((field) => {
                    if (field === 'id_user') {
                        filter[field] = '00000000-0000-0000-0000-000000000000';
                        return;
                    }

                    filter[field] = entity[field];
                });

                const result = await this.model.updateOne(
                    filter as any,
                    {
                        $setOnInsert: {
                            ...entity,
                            id_user: '00000000-0000-0000-0000-000000000000',
                        },
                    },
                    { upsert: true },
                );

                if (result.upsertedCount > 0) {
                    console.log('Entity inserted:', filter);
                } else {
                    console.log('Entity already exists:', filter);
                }
            }
        } catch (error) {
            console.error('Error inserting document:', error);
        }
    }
}
