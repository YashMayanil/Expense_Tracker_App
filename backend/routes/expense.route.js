import {Router} from "express"
import {addExpense, getAllExpense, markAsDoneOrUndone, removeExpense, updateExpense} from "../controllers/expense.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js"
const router = Router();

router.route("/add").post(isAuthenticated,addExpense);
router.route("/getAll").get(isAuthenticated,getAllExpense);
router.route("/remove/:id").delete(isAuthenticated,removeExpense);
router.route("/update/:id").put(isAuthenticated,updateExpense);
router.route("/:id/done").put(isAuthenticated,markAsDoneOrUndone);


export default router;
