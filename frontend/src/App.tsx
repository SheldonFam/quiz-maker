import "./App.css";
import { useQuery } from "@tanstack/react-query";
import { readCurriculumOptions } from "./client/@tanstack/react-query.gen";

function App() {
  const curriculumQuery = useQuery(readCurriculumOptions());

  if (curriculumQuery.isPending) {
    return <p>Loading...</p>;
  }

  if (curriculumQuery.isError) {
    return <p>Could not load the curriculum.</p>;
  }

  return (
    <>
      <ul>
        {curriculumQuery.data.data.map((level) => (
          <li key={level.name}>
            {level.name} ({level.curriculum})
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
