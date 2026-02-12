export default async function handler(req: any, res: any) {
  const appModule = await eval('import("../backend/src/app.js")');
  return appModule.default(req, res);
}
