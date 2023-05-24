import React from "react";
import { Form, Formik } from "formik";
import { Box, Button } from "@chakra-ui/react";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useRegisterMutation } from "../generated/graphql";

interface RegisterProps {}

const Register: React.FC<RegisterProps> = ({}) => {
  const [{}, register] = useRegisterMutation();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values) => {
          console.log(values);
          const { username, password } = values;
          const response = await register({ username, password });
          return response;
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name={"username"}
              placeholder={"username"}
              label={"Username"}
            />
            <Box mt={4}>
              <InputField
                name={"password"}
                placeholder={"password"}
                label={"Password"}
                type="password"
              />
            </Box>
            <Button
              mt={4}
              isLoading={isSubmitting}
              type="submit"
              colorScheme={"teal"}
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
