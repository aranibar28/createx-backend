const { response } = require("express");
const { titleCase } = require("../utils/functions");
const { admin } = require("../utils/data");

const Employee = require("../models/employee");
const Branch = require("../models/branch");
const bcrypt = require("bcryptjs");

const create_employee = async (req, res = response) => {
	let data = req.body;
	try {
		let exist_email = await Employee.findOne({ email: data.email });
		if (exist_email) {
			return res.json({ msg: "Este correo ya se encuentra registrado.", exist: true });
		} else {
			data.password = bcrypt.hashSync(data.password, bcrypt.genSaltSync());
			data.full_name = titleCase(data.first_name + " " + data.last_name);
			let reg = await Employee.create(data);
			return res.json({ data: reg });
		}
	} catch (error) {
		return res.json({ msg: error.message });
	}
};

const read_employees = async (req, res = response) => {
	const { page = 1, limit = 10, search = "", status } = req.query;
	try {
		const query = {
			full_name: { $regex: search, $options: "i" },
			status: { $ne: null },
		};

		if (status) {
			query.status = status;
		}

		const options = {
			page,
			limit,
		};

		let reg = await Employee.paginate(query, options);

		return res.json(reg);
	} catch (error) {
		return res.json({ msg: error.message });
	}
};

const read_employee_by_id = async (req, res = response) => {
	let id = req.params["id"];
	try {
		let reg = await Employee.findById(id);
		return res.json({ data: reg });
	} catch (error) {
		return res.json({ data: undefined });
	}
};

const update_employee = async (req, res = response) => {
	let id = req.params["id"];

	try {
		const user = await Employee.findById(id);
		const { email, password, ...data } = req.body;

		if (user.email != email) {
			let exist_email = await Employee.findOne({ email });
			if (exist_email) {
				return res.json({ msg: "Este correo ya se encuentra registrado.", exist: true });
			} else {
				data.email = email;
			}
		}

		if (password) {
			data.password = bcrypt.hashSync(password, bcrypt.genSaltSync());
		}

		data.full_name = titleCase(data.first_name + " " + data.last_name);
		let reg = await Employee.findByIdAndUpdate(id, data, { new: true });
		return res.json({ data: reg });
	} catch (error) {
		return res.json({ msg: error.message });
	}
};

const delete_employee = async (req, res = response) => {
	let id = req.params["id"];
	try {
		if (admin._id == id) {
			return res.json({ msg: "No puedes eliminar a un administrador." });
		}

		if (req.id == id) {
			return res.json({ msg: "No puedes eliminar un usuario con sesión iniciada." });
		}

		const hasRole = await Branch.findOne({ employee: id }).exec();
		if (hasRole) {
			return res.json({ msg: "No puedes eliminar un usuario con rol asignado." });
		}

		let reg = await Employee.findByIdAndDelete(id);
		return res.json({ data: reg });
	} catch (error) {
		return res.json({ msg: error.message });
	}
};

const delete_employees = async (req, res = response) => {
	let data = req.body;
	try {
		// Implementar las tres reglas ![is admin, is session, has role]
		let ids = data.map(item => item._id);
		let filteredIds = [];
		for (let i = 0; i < ids.length; i++) {
			if (admin._id !== ids[i] && req.id !== ids[i]) {
				const hasRole = await Branch.findOne({ employee: ids[i] }).exec();
				if (!hasRole) {
					filteredIds.push(ids[i]);
				}
			}
		}
		// Eliminar solo los usuarios que cumplen con las tres reglas
		const deleted = await Employee.deleteMany({ _id: { $in: filteredIds } });
		return res.json(deleted);
	} catch (error) {
		return res.json({ msg: error.message });
	}
};


module.exports = {
	create_employee,
	read_employees,
	read_employee_by_id,
	update_employee,
	delete_employee,
	delete_employees
};
