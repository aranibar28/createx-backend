const timestamps = {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at",
    },
};

const admin = {
    _id: process.env.ROOT_ID,
    email: process.env.ROOT_EMAIL,
    password: "$2a$10$etydPmuQhSk6ja2b09DLdujTJlbXMuNcNqQfloxhvAHJA08m7YdsK",
    full_name: "Gerson Rolando Aranibar Concha",
    first_name: "GERSON ROLANDO",
    last_name: "ARANIBAR CONCHA",
    dni: "70800756",
    status: true,
};

const role = {
    _id: "639a4b3a450e8665bd81950d",
    title: "Administrador",
    status: true,
    allows: {
        employees: true,
        suppliers: true,
        categories: true,
        products: true,
        purchases: true,
        sales: true,
        roles: true,
        config: true,
    },
};

const business = {
    _id: "63b8327336b9a4be424f90ad",
    ruc: "20537211173",
    title: "HERRWAR S.A.C.",
    district: "PUENTE PIEDRA",
    province: "LIMA",
    address: "MZA. C9 LOTE. 8 ASOC CESAR VALLEJO LIMA LIMA PUENTE PIEDRA",
};

const config = {
    _id: "625862ce65ef51929554ff29",
    business: "63b8327336b9a4be424f90ad",
    tax: 0.18,
    currency: "PEN",
    ticket: [
        { serie: "B001", number: "0000001", status: true },
        { serie: "B002", number: "0000001", status: false },
    ],
    invoice: [
        { serie: "F001", number: "0000001", status: true },
        { serie: "F002", number: "0000001", status: false },
    ],
    status: true,
};

const branch = {
    _id: "63a07575aa17229718c9ccd2",
    status: true,
    business: "63b8327336b9a4be424f90ad",
    employee: process.env.ROOT_ID,
    role: "639a4b3a450e8665bd81950d",
};

const arr_months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

module.exports = Object.freeze({
    timestamps,
    admin,
    role,
    business,
    config,
    branch,
    arr_months,
});
