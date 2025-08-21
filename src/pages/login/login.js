import { Helmet } from "react-helmet";
import { FormAuth } from "../../components/authForm/form";
export const Login = () => {
    return (
        <>
            <Helmet>
                <title>Login - Todo App</title>
                <meta name="description" content="Login to your Todo App account to manage tasks." />
            </Helmet>
            <FormAuth title="Login" fields={["userName", "email", "password"]} endPoint="login" buttonName="Login" />

        </>
        )
}