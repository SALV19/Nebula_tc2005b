-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 08-03-2025 a las 05:37:43
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `nebula`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `colaborador`
--

CREATE TABLE `colaborador` (
  `id_colaborador` varchar(36) PRIMARY KEY,
  `nombre` varchar(250) NOT NULL,
  `apellidos` varchar(250) NOT NULL,
  `fechaNacimiento` date NOT NULL,
  `telefono` BIGINT UNIQUE,
  `puesto` varchar(250) NOT NULL,
  `email` varchar(250) NOT NULL UNIQUE,
  `contrasena` varchar(250) NOT NULL,
  `fechaIngreso` date NOT NULL,
  `fechaSalida` date,
  `ubicacion` varchar(250) NOT NULL,
  `modalidad` tinyint(4) NOT NULL,
  `estado` tinyint(1) NOT NULL,
  `foto` varchar(250) NOT NULL,
  `curp` varchar(250) NOT NULL UNIQUE,
  `rfc` varchar(250) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `departamento`
--

CREATE TABLE `departamento` (
  `id_departamento` int(8) PRIMARY KEY,
  `nombre_departamento` varchar(250) NOT NULL,
  `id_empresa` varchar(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dias_feriados`
--

CREATE TABLE `dias_feriados` (
  `id_diaFeriado` int(8) PRIMARY KEY,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date,
  'hora_inicio' time,
  'hora_fin' time,
  `motivo` varchar(250) DEFAULT NULL,
  `tipo` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empresa`
--

CREATE TABLE `empresa` (
  `id_empresa` int(8) PRIMARY KEY,
  `nombre_empresa` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `equipo`
--

CREATE TABLE `equipo` (
  `id_colaborador` varchar(36) NOT NULL,
  `id_rol` int(8) NOT NULL,
  `id_departamento` int(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evaluaciones_de_seguimiento`
--

CREATE TABLE `evaluaciones_de_seguimiento` (
  `id_evaluacion` int(8) PRIMARY KEY,
  `id_colaborador` varchar(36) NOT NULL,
  `fechaAgendada` date NOT NULL,
  `notas` varchar(250)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evento`
--

CREATE TABLE `evento` (
  `id_colaborador` varchar(36) NOT NULL,
  `id_diaFeriado` int(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fa`
--

CREATE TABLE `fa` (
  `id_fa` int(8) PRIMARY KEY,
  `id_colaborador` varchar(36) NOT NULL,
  `motivo` varchar(250) NOT NULL,
  `fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `indicador`
--

CREATE TABLE `indicador` (
  `id_indicador` int PRIMARY KEY,
  `indicador` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `metrica_indicadores`
--

CREATE TABLE `metrica_indicadores` (
  `id_evaluacion` int(8) NOT NULL,
  `id_indicador` int(8) NOT NULL,
  `valor_metrica` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `permisos`
--

CREATE TABLE `permisos` (
  `nombre_permiso` varchar(50) PRIMARY KEY,
  `descripcion` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `preguntas_evaluacion`
--

CREATE TABLE `preguntas_evaluacion` (
  `id_pregunta` int(8) PRIMARY KEY,
  `pregunta` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respuestas_pregunta`
--

CREATE TABLE `respuestas_pregunta` (
  `id_pregunta` int(8) NOT NULL,
  `id_evaluacion` int(8) NOT NULL,
  `respuesta` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `id_rol` int(8) PRIMARY KEY,
  `tipo_rol` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol_permisos`
--

CREATE TABLE `rol_permisos` (
  `nombre_permiso` varchar(50) NOT NULL,
  `id_rol` int(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudes_falta`
--

CREATE TABLE `solicitudes_falta` (
  `id_solicitud_falta` int(8) PRIMARY KEY,
  `id_colaborador` varchar(36) NOT NULL,
  `estado` tinyint(1) NOT NULL,
  `tipo_falta` varchar(250) NOT NULL,
  `descripcion` varchar(250),
  `ubicacion` varchar(250) NOT NULL,
  `evidencia` varchar(250) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

CREATE TABLE `dias_solicitados` (
  `id_solicitud_falta` int(8) NOT NULL,
  `fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Indices de la tabla `equipo`
--
ALTER TABLE `equipo`
  ADD PRIMARY KEY (`id_colaborador`,`id_rol`,`id_departamento`),
  ADD KEY `fk_equipo_departamento` (`id_departamento`),
  ADD KEY `fk_equipo_rol` (`id_rol`);

--
-- Indices de la tabla `evaluaciones_de_seguimiento`
--
ALTER TABLE `evaluaciones_de_seguimiento`
  ADD PRIMARY KEY (`id_evaluacion`),
  ADD KEY `id_colaborador` (`id_colaborador`);

--
-- Indices de la tabla `evento`
--
ALTER TABLE `evento`
  ADD PRIMARY KEY (`id_colaborador`,`id_diaFeriado`),
  ADD KEY `fk_evento_diaFeriado` (`id_diaFeriado`);

--
-- Indices de la tabla `fa`
--
ALTER TABLE `fa`
  ADD PRIMARY KEY (`id_fa`),
  ADD KEY `fk_colaborador` (`id_colaborador`);

--
-- Indices de la tabla `indicador`
--
ALTER TABLE `indicador`
  ADD PRIMARY KEY (`id_indicador`);

--
-- Indices de la tabla `metrica_indicadores`
--
ALTER TABLE `metrica_indicadores`
  ADD PRIMARY KEY (`id_evaluacion`,`id_indicador`),
  ADD KEY `fk_indicador` (`id_indicador`);

--
-- Indices de la tabla `permisos`
--
ALTER TABLE `permisos`
  ADD PRIMARY KEY (`nombre_permiso`);

--
-- Indices de la tabla `preguntas_evaluacion`
--
ALTER TABLE `preguntas_evaluacion`
  ADD PRIMARY KEY (`id_pregunta`);

--
-- Indices de la tabla `respuestas_pregunta`
--
ALTER TABLE `respuestas_pregunta`
  ADD PRIMARY KEY (`id_pregunta`,`id_evaluacion`),
  ADD KEY `fk_evaluacionR` (`id_evaluacion`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`id_rol`);

--
-- Indices de la tabla `rol_permisos`
--
ALTER TABLE `rol_permisos`
  ADD PRIMARY KEY (`nombre_permiso`,`id_rol`),
  ADD KEY `fk_rol` (`id_rol`);

--
-- Indices de la tabla `solicitudes_falta`
--
ALTER TABLE `solicitudes_falta`
  ADD PRIMARY KEY (`id_solicitud_falta`),
  ADD KEY `fk_colaboradorf` (`id_colaborador`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `departamento`
--
ALTER TABLE `departamento`
  MODIFY `id_departamento` int(8) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `dias_feriados`
--
ALTER TABLE `dias_feriados`
  MODIFY `id_diaFeriado` int(8) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `empresa`
--
ALTER TABLE `empresa`
  MODIFY `id_empresa` int(8) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `evaluaciones_de_seguimiento`
--
ALTER TABLE `evaluaciones_de_seguimiento`
  MODIFY `id_evaluacion` int(8) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `fa`
--
ALTER TABLE `fa`
  MODIFY `id_fa` int(8) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `indicador`
--
ALTER TABLE `indicador`
  MODIFY `id_indicador` int(8) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `preguntas_evaluacion`
--
ALTER TABLE `preguntas_evaluacion`
  MODIFY `id_pregunta` int(8) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `id_rol` int(8) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `solicitudes_falta`
--
ALTER TABLE `solicitudes_falta`
  MODIFY `id_solicitud_falta` int(8) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `equipo`
--
ALTER TABLE `equipo`
  ADD CONSTRAINT `fk_equipo_colaborador` FOREIGN KEY (`id_colaborador`) REFERENCES `colaborador` (`id_colaborador`),
  ADD CONSTRAINT `fk_equipo_departamento` FOREIGN KEY (`id_departamento`) REFERENCES `departamento` (`id_departamento`),
  ADD CONSTRAINT `fk_equipo_rol` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`);

--
-- Filtros para la tabla `evaluaciones_de_seguimiento`
--
ALTER TABLE `evaluaciones_de_seguimiento`
  ADD CONSTRAINT `id_colaborador` FOREIGN KEY (`id_colaborador`) REFERENCES `colaborador` (`id_colaborador`);

--
-- Filtros para la tabla `evento`
--
ALTER TABLE `evento`
  ADD CONSTRAINT `fk_evento_colaborador` FOREIGN KEY (`id_colaborador`) REFERENCES `colaborador` (`id_colaborador`),
  ADD CONSTRAINT `fk_evento_diaFeriado` FOREIGN KEY (`id_diaFeriado`) REFERENCES `dias_feriados` (`id_diaFeriado`);

--
-- Filtros para la tabla `fa`
--
ALTER TABLE `fa`
  ADD CONSTRAINT `fk_colaborador` FOREIGN KEY (`id_colaborador`) REFERENCES `colaborador` (`id_colaborador`);

--
-- Filtros para la tabla `rol_permisos`
--
ALTER TABLE `rol_permisos`
  ADD CONSTRAINT `fk_nombre_permiso` FOREIGN KEY (`nombre_permiso`) REFERENCES `permisos` (`nombre_permiso`),
  ADD CONSTRAINT `fk_rol` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`);

--
-- Filtros para la tabla `solicitudes_falta`
--
ALTER TABLE `solicitudes_falta`
  ADD CONSTRAINT `fk_colaboradorf` FOREIGN KEY (`id_colaborador`) REFERENCES `colaborador` (`id_colaborador`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
