import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import cloneDeep from "lodash.clonedeep";
import { supabase } from "./components/supabase";

if (typeof global.structuredClone !== "function") {
  global.structuredClone = (obj) => cloneDeep(obj);
}

export default function AuthScreen() {
  const [isSignIn, setIsSignIn] = useState(true); // true = login, false = signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null); // texto a mostrar
  const [messageType, setMessageType] = useState(null); // 'error' o 'success'

  const handleAuth = async () => {
    setMessage(null);
    setMessageType(null);

    if (!email.trim() || !password) {
      Alert.alert("Error", "Por favor ingresa email y contraseña");
      setMessage("Por favor ingresa email y contraseña");
      setMessageType("error");
      console.log("Validación fallida: email o password vacíos");
      return;
    }

    try {
      if (isSignIn) {
        console.log("Intentando login con:", email);

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        console.log("Respuesta login:", { data, error });

        if (error) {
          Alert.alert("Error", error.message);
          setMessage(error.message);
          setMessageType("error");
        } else if (!data.session) {
          const msg = "No se pudo iniciar sesión. ¿Confirmaste tu correo?";
          Alert.alert("Error", msg);
          setMessage(msg);
          setMessageType("error");
        } else {
          const msg = "Inicio de sesión exitoso";
          Alert.alert("Éxito", msg);
          setMessage(msg);
          setMessageType("success");
          // Aquí puedes guardar sesión o navegar a otra pantalla
        }
      } else {
        console.log("Intentando registro con:", email);

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        console.log("Respuesta registro:", { data, error });

        if (error) {
          Alert.alert("Error", error.message);
          setMessage(error.message);
          setMessageType("error");
        } else {
          const msg =
            "Registro exitoso. Revisa tu correo para confirmar la cuenta.";
          Alert.alert("Éxito", msg);
          setMessage(msg);
          setMessageType("success");
          setIsSignIn(true);
        }
      }
    } catch (e) {
      console.log("Error en handleAuth:", e);
      Alert.alert("Error inesperado", e.message || "Revisa la consola.");
      setMessage("Error inesperado: " + (e.message || e));
      setMessageType("error");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isSignIn ? "Iniciar sesión" : "Registrarse"}
      </Text>
      <TextInput
        placeholder="Correo electrónico"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Contraseña"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleAuth}>
        <Text style={styles.buttonText}>
          {isSignIn ? "Iniciar sesión" : "Registrarse"}
        </Text>
      </TouchableOpacity>

      {message && (
        <Text
          style={[
            styles.message,
            messageType === "error" ? styles.error : styles.success,
          ]}
        >
          {message}
        </Text>
      )}

      <TouchableOpacity
        onPress={() => {
          setIsSignIn(!isSignIn);
          setMessage(null); // limpia mensajes al cambiar de formulario
        }}
      >
        <Text style={styles.switchText}>
          {isSignIn
            ? "¿No tienes cuenta? Regístrate"
            : "¿Ya tienes cuenta? Inicia sesión"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  switchText: {
    color: "#007bff",
    textAlign: "center",
    textDecorationLine: "underline",
  },
  message: {
    textAlign: "center",
    marginBottom: 15,
    fontSize: 14,
  },
  error: { color: "red" },
  success: { color: "green" },
});
