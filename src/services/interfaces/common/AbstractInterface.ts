export interface AbstractInterface<T> {
    getById(id: string): () => T;
    create(model: T): T;
    update(updatedModel: T): T;
    delete(id: string): boolean;
}