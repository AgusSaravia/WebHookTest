const express = require('express');
const { Octokit } = require('@octokit/rest');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config()

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json())
console.log("escucho 1 2 3")
const octokit = new Octokit({
    auth: process.env.GIT_TOKEN,
    userAgent: 'skylight v1'
});

app.post('/api/github', async (req, res) => {
    //Owner and repo comes from form on front end
    const { owner, repo } = req.body

    console.log("Escuchando")
    try {
        const response = await octokit.repos.get({
            owner,
            repo,
        });
        res.json(response.data)
        console.log("respuesta", response);
    }
    catch (error) {

        console.error("Error: ", error);

        if (error.status) {
            res.status(error.status).json({
                error: "GitHub API error",
                message: error.message
            })
        } else {

            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
})
app.get('/api/github', (req, res) => {
    res.status(405).json({ error: 'Method Not Allowed' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});