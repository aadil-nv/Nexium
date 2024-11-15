export default interface IManagerController {
    createManager(req: Request, res: Response): Promise<void>;
}