import OAuthClient from "@/services/OAuthClient"
import { Button } from "@/components/ui/shadcn/button"

function AuthButton({ client }: { client?: OAuthClient }) {
    const text = client && client.isAuthenticated
        ? "Sign Out"
        : "Sign In"

    const cb = !client
        ? () => { }
        : client.isAuthenticated ? client.signOut.bind(client) : client.signIn.bind(client)

    const variant = client && client.isAuthenticated ? 'secondary' : 'outline';

    return <Button variant={variant} onClick={() => cb()}>{text}</Button>
}

export default AuthButton