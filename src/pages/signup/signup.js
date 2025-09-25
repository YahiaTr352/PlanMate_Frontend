import { FormAuth } from "../../components/authForm/form";

export const Signup = () => {
    return <FormAuth title="Register" fields={["userName", "email", "password", "passwordC"]} endPoint="signup" buttonName="Register" />
}