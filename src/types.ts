import type * as ts from "typescript/lib/tsserverlibrary";

export interface SynchronizedConfiguration {}

export interface Config {
    pid: number;
    token: string
}

export interface API {
    method: string
    path: string
}

export interface Category {
    name: string
    desc: string
    list: API[]
}

export interface RefactorContext {
    program: ts.Program;
    file: ts.SourceFile;
}

export enum OkType {
    Ok,
    Err
}

export interface IOk<T> {
    type: OkType.Ok;
    value: T;
}

export interface IError<E = never> {
    type: OkType.Err;
    reason?: string;
    extra?: E;
}

export type Result<T, E> = IOk<T> | IError<E>;

export function Ok<T>(value: T): IOk<T> {
    return {
        type: OkType.Ok,
        value
    };
}

export function Err<E>(reason?: string, extra?: E): IError<E> {
    return {
        type: OkType.Err,
        reason,
        extra
    };
}

