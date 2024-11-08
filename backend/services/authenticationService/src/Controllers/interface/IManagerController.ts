export default interface IManagerController {
    login(req: Request, res: Response): Promise<Response>;
}


