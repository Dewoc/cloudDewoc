import { AssetsViewTableType, BotInputType, BotInputViewTableType, BotType, GeneralResData, JobsViewTableType, LogsType, TriggersViewTableType, UserType } from "./../types";;

export interface UserLoginResData extends GeneralResData { data: UserType }
export interface UserListResData extends GeneralResData { data: UserType[] }
export interface UpdateUserResData extends GeneralResData { data: UserType }
export interface UpdateBotResData extends GeneralResData { data: BotType & { errors: string } }
export interface UpdateBotInputResData extends GeneralResData { data: BotInputViewTableType }
export interface UpdateTriggerResData extends GeneralResData { data: TriggersViewTableType }

export interface BotListResData extends GeneralResData { data: BotType[] }
export interface BotInputListResData extends GeneralResData { data: BotInputType[] }
export interface JobListResData extends GeneralResData { data: JobsViewTableType[] }
export interface LogListResData extends GeneralResData { data: LogsType[] }

export interface AssetsListResData extends GeneralResData { data: AssetsViewTableType[] }
export interface TriggersListResData extends GeneralResData { data: TriggersViewTableType[] }
