import { useEffect, useState } from "react";
import Req from "../tools/request";
import { Form, Input, Button } from "antd";
import { send } from "emailjs-com";

export default function Home() {
  const [questions, setQuestions] = useState();
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [ans, setAns] = useState();
  const [select, setSelect] = useState(0);
  const [done, setDone] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [email, setEmail] = useState();

  useEffect(() => {
    Req().then((e) => setQuestions(e));
  }, []);
  useEffect(() => {
    setScore(select == ans ? score + 1 : score);
  }, [ans]);

  useEffect(() => {
    setTimeout(() => {
      done || !email ? "" : setSeconds(seconds + 1);
    }, 1000);
  }, [seconds, email]);

  function answer(value) {
    setSelect(value);
    setAns(questions[index].correct_answer);
    setTimeout(() => {
      if (index < questions.length - 1) {
        setIndex(index + 1);
        setAns("");
        setSelect(0);
      } else {
        setDone(true);
        let toSend = {
          from_name: "QA Team",
          to_name: "Dear",
          message: `your score in Exam is ${
            score +
            " / " +
            questions.length +
            ". time you take is " +
            new Date(seconds * 1000).toISOString().substr(11, 8)
          }`,
          reply_to: email,
          send_to: email,
        };
        send(
          process.env.EMAIL_SERVICE_KEY,
          process.env.EMAIL_TEMPLATE_ID,
          toSend,
          process.env.EMAIL_USER_ID
        )
          .then((response) => {
            console.log("SUCCESS!", response.status, response.text);
          })
          .catch((err) => {
            console.log("FAILED...", err);
          });
      }
    }, 1000);
  }

  const onFinish = (values) => {
    console.log("Success:", values);
    setEmail(values.email);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="home">
      {!!questions ? (
        <div className={`container ${done || !email ? "done" : ""}`}>
          <div className={`question ${done || !email ? "done" : ""}`}>
            <img src="./img/waves.svg" alt="" />
            <div className="ques-text">
              {!email ? (
                <div>
                  <p className="title">
                    <p className="logo">QA</p>
                    <p className="logo-text">
                      QuizApp to check <br />
                      your knowledge in JS
                    </p>
                  </p>
                  <Form
                    className="email-form"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                  >
                    <Form.Item
                      name="email"
                      rules={[
                        {
                          required: true,
                          type: "email",
                          message: "Please input E-mail!",
                        },
                      ]}
                      style={{ margin: 0 }}
                    >
                      <Input
                        className="email-input"
                        placeholder="Enter your email"
                      />
                    </Form.Item>

                    <Form.Item>
                      <Button className="email-form-btn" htmlType="submit">
                        Next
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              ) : done ? (
                <span>
                  <span className="score-text">
                    Your Score is {`${score}/${questions.length}`}
                  </span>
                  <br />
                  {`time you take : ${new Date(seconds * 1000)
                    .toISOString()
                    .substr(11, 8)}`}
                  <br />
                  <small>also you will recive your score on mail</small>
                </span>
              ) : (
                `${index + 1} - ${questions[index].question}`
              )}
            </div>
            <div className="next">
              <button
                onClick={() =>
                  index < questions.length - 1 ? setIndex(index + 1) : answer(0)
                }
              >
                {index < questions.length - 1 ? "Next >" : "Finish"}
              </button>
            </div>
          </div>
          <div className={`answer ${done ? "done" : ""}`}>
            <div className="options">
              {Object.keys(questions[index].answers).map((value, key) => {
                if (questions[index].answers[value] != null) {
                  return (
                    <button
                      onClick={() => answer(value)}
                      key={key}
                      disabled={ans && select ? "disabled" : ""}
                    >
                      <div
                        className={`option  ${
                          ans && select
                            ? ans == value
                              ? "success"
                              : select == value
                              ? "failed"
                              : ""
                            : ""
                        }`}
                      >
                        <p>
                          {key + 1 + " - " + questions[index].answers[value]}
                        </p>
                      </div>
                    </button>
                  );
                }
              })}
            </div>
            <div className="score">
              <p>
                Score:{" "}
                <span>
                  {score}/{questions.length}
                </span>
                <hr></hr>
                <span>
                  {new Date(seconds * 1000).toISOString().substr(11, 8)}
                </span>
              </p>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
