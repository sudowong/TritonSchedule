async function test() {
  const url =
    "https://act.ucsd.edu/scheduleOfClasses/scheduleOfClassesStudentResult.htm";

  const searchRequest = {
    selectedTerm: "Wl26",
    tabNum: "tabs-dept",
    selectedDepartments: ["CSE"],
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
    },
    body: JSON.stringify(searchRequest),
  });

  console.log(response);
}

test();
