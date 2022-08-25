import { useState } from "react";
import NextLink from "next/link";
import { useForm } from "react-hook-form";

import {
  Box,
  Button,
  Chip,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";

import { ErrorOutline } from "@mui/icons-material";
import { AuthLayout } from "../../components/layouts";
import { validations } from "../../utils";
import { tesloApi } from "../../api";

type FormData = {
  name: string;
  email: string;
  password: string;
};

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [showError, setShowError] = useState(false);

  const onRegisterForm = async ({ name, email, password }: FormData) => {
    try {
      const { data } = await tesloApi.post("/user/register", {
        name,
        email,
        password,
      });
      const { token, user } = data;
      console.log({ token, user });
    } catch (error) {
      console.log("Error en las credenciales");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  return (
    <AuthLayout title={"Ingresar"}>
      <form onSubmit={handleSubmit(onRegisterForm)} noValidate>
        <Box sx={{ width: 350, padding: "10px 20px " }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">
                Crear Cuenta
              </Typography>
              <Chip
                label="Error al registrarse"
                color="error"
                icon={<ErrorOutline />}
                className="fadeIn"
                sx={{ display: showError ? "flex" : "none" }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Nombre completo"
                variant="filled"
                fullWidth
                {...register("name", {
                  required: "El nombre es requerido",
                  minLength: {
                    value: 2,
                    message: "Debe contener al menos 2 caracteres",
                  },
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                type="email"
                label="Correo"
                variant="filled"
                fullWidth
                {...register("email", {
                  required: true,
                  validate: validations.isEmail,
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="contraseña"
                type="password"
                variant="filled"
                fullWidth
                {...register("password", {
                  required: "La contraseña es requerida",
                  minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres",
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                color="secondary"
                className="circular-btn"
                size="large"
                fullWidth
              >
                Ingresar
              </Button>
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="end">
              <NextLink href="/auth/login" passHref>
                <Link underline="always">¿ya tienes cuenta?</Link>
              </NextLink>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
