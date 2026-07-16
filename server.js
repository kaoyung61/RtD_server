import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

app.post("/api/query", async (req, res) => {

    const value = req.body.value;

    if (value === undefined) {
        return res.json({
            error: "No value"
        });
    }

    const number = Number(value);

    if (!isNaN(number)) {

        return res.json({
            type: "number",
            result: number % 2 === 0 ? "Четное" : "Нечетное"
        });

    }

    const { data, error } = await supabase
        .from("dictionary")
        .select("call_out")
        .eq("call_in", value)
        .single();

    if (error || !data) {

        return res.json({
            type: "text",
            result: "Не найдено"
        });

    }

    return res.json({
        type: "text",
        result: data.call_out
    });

});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server started");
});

app.get("/", (req, res) => {
    res.send("Server is running");
});