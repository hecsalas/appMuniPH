-- Esquema de Base de Datos Mi Padre Hurtado (MiPH)

-- 1. Tabla de Comercios
CREATE TABLE comercios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre_fantasia TEXT NOT NULL,
    razon_social TEXT,
    rut TEXT UNIQUE,
    categoria TEXT,
    direccion_matriz TEXT,
    telefono TEXT,
    email TEXT,
    estado TEXT DEFAULT 'Pendiente', -- Vigente, Pendiente, Vencido, Rechazado
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla de Sucursales
CREATE TABLE sucursales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    comercio_id UUID REFERENCES comercios(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    direccion TEXT,
    comuna TEXT DEFAULT 'Padre Hurtado'
);

-- 3. Tabla de Beneficios
CREATE TABLE beneficios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    comercio_id UUID REFERENCES comercios(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    dias_uso TEXT,
    horario_uso TEXT,
    condiciones TEXT
);

-- 4. Tabla de Solicitudes de Canje (Historial)
CREATE TABLE solicitudes_canje (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    comercio_id UUID REFERENCES comercios(id),
    beneficio_id UUID REFERENCES beneficios(id),
    vecino_nombre TEXT NOT NULL,
    estado TEXT DEFAULT 'Pendiente', -- Pendiente, Aprobado, Rechazado, Cancelado
    motivo_rechazo TEXT,
    fecha_solicitud TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_respuesta TIMESTAMP WITH TIME ZONE
);

-- 5. Tabla de Administradores de Comercios (Socios)
CREATE TABLE administradores_comercios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    comercio_id UUID REFERENCES comercios(id),
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_temporal TEXT
);
