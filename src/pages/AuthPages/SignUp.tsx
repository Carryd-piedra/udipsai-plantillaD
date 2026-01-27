import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="UDIPSAI - SignUp"
        description="Esta es la SignUp page de UDIPSAI"
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
