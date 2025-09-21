import { getTranslations } from "next-intl/server"

export default async function Login() {
  const t = await getTranslations()
  return (
    <>
      <div>
        <h1>Entrar</h1>
        <form>
          <div>
            <label>Email</label>
            <input type="email" />
          </div>
          <div>
            <label>Senha</label>
            <input type="password" />
          </div>
          <button>Entrar</button>
        </form>
        <div>
          <a>Ainda não tem uma conta? Registre-se</a>
        </div>
      </div>
    </>
  )
}