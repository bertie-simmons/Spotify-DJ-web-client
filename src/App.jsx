import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Callback from './pages/Callback';
import { Music } from 'lucide-react';

// Login page component
const Login = () => {
  const { login } = useAuth();