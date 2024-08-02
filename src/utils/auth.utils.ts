import bcrypt from "bcrypt";
export const comparepassword = async (password: string, hash: string):Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
export const HashedPassword=async (password:string ):Promise<string>=>{
  let saltRounds=10;
  
return await bcrypt.hash(password,saltRounds);

}