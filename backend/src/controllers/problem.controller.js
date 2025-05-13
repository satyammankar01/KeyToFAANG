import {db} from "../libs/db.js"
import { getJudge0LanguageId, submitBatch } from "../libs/judge0.libs.js"
import { pollBatchResults } from "../libs/judge0.libs.js"



export const createProblem = async(req , res) => {
    const {title,description,difficulty, tags ,userId,examples,constraints,testcases,codesnippets,referenceSolution} = req.body
    if(req.user.role !== ADMIN){
        return res.status(400).json({
            error:"Problems can only be created by ADMIN"
        })
    }
    try {
        for(const [language , solutionCode] of Object.entries(referenceSolution)){
            const languageId = getJudge0LanguageId(language)
            if(!language){
                return res.status(400).json({
                    error:"This language is not supported"
                })
            }

            const submissions = testcases.map(({input , output})=> ({
                source_code : solutionCode,
                language_id : languageId,
                stdin:input,
                expected_output:output
            }))

            const submissionResult = await submitBatch(submissions)
            console.log(submissionResult)

            const token = submissionResult.map((res)=>res.token)
            console.log(token)

            const result = await pollBatchResults(token)
            
            for(let i = 0; i < result.length ; i++){
                const result = results[i]
                if(result.status.id !== 3){
                    return res.status(400).json({
                        error:`Testcase ${i+1} failed for language ${language}`
                    })
                }
            }

            const newProblem = await db.problem.create({
                data:{
                    title,
                    description,
                    difficulty, 
                    tags,
                    userId:req.user.id,
                    examples,
                    constraints,
                    testcases,
                    codesnippets,
                    referenceSolution
                }
            })


            return res.status(200).json(newProblems)
            
        }
    } catch (error) {
        return res.status(400).json({
            message:"catch error while creating new problem"
        })
    }
}

export const getAllProblems = async(req , res) => {}

export const getProblem = async(req , res) => {}

export const updateProblem = async (req , res) => {}


export const deleteProblem = async (req , res) => {}


export const getSolvedProblems = async (req , res) => {}