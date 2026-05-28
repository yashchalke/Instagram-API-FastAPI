from passlib.context import CryptContext

pwd_cxt = CryptContext(schemes=['argon2'],deprecated='auto')

class Hash():
    def bcrypt(password:str):
        return pwd_cxt.hash(password)
    
    def verify_pwd(hash:str,plain_password:str):
        return pwd_cxt.verify(plain_password,hash)