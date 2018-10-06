
// The contents of this file are auto-generated from swagger.yaml definitions.
// Do not edit directly.

export interface Alarm {
    id: string; // ^[\da-fA-F]{8}-[\da-fA-F]{4}-[\da-fA-F]{4}-[\da-fA-F]{4}-[\da-fA-F]{12}
    name: string;
    alertAt: string; // date-time
    iconEmoji?: string; // ^\:(\w+|\+\w+)\:$
}
export interface ErrorResponse {
    message: string;
}

