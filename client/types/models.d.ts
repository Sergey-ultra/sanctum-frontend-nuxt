export {}
declare global {
    export namespace models {

        export interface Provider {
            // columns
            id: number
            user_id: number
            avatar?: string
            name: string
            payload: string
            created_at?: Date
            updated_at?: Date
        }

        export type Providers = Array<Provider>

        export interface User {
            role: string
            name?: string
            avatar?: string
        }

        export type Users = Array<User>

    }
}
