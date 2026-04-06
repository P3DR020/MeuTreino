const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verifica se email já existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    // Criptografa a senha
    const passwordHash = await bcrypt.hash(password, 10);

    // Cria o usuário
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
    });

    res
      .status(201)
      .json({ message: "Usuário criado com sucesso!", userId: user.id });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Busca o usuário
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Email ou senha inválidos" });
    }

    // Verifica a senha
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Email ou senha inválidos" });
    }

    // Gera o token JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao fazer login" });
  }
};

module.exports = { register, login };
