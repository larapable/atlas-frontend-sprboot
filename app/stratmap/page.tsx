"use client";
import { useSession } from "next-auth/react";
import React, { ChangeEvent, useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const Page = () => {
  const { data: session } = useSession();

  let user;
  if (session?.user?.name) user = JSON.parse(session.user?.name as string);
  const department_id = user?.department_id;
  const username = user?.username;

  useEffect(() => {
    if (username) {
      checkGeneratedAiStrats(username);
    }
  }, [session]);

  interface ResponseRow {
    "s-tResponses": string;
  }

  interface GeneratedSentence {
    id: number;
    fID: number;
    value: string;
  }

  interface StrategyCategories {
    financial: GeneratedSentence[];
    stakeholder: GeneratedSentence[];
    internalProcess: GeneratedSentence[];
    learningGrowth: GeneratedSentence[];
  }

  // for vision values mission
  const [showVisionCard, setShowVisionCard] = useState(false);
  const [showValuesCard, setShowValuesCard] = useState(false);
  const [showMissionCard, setShowMissionCard] = useState(false);
  const [visionSaved, setVisionSaved] = useState(false);
  const [valuesSaved, setValuesSaved] = useState(false);
  const [missionSaved, setMissionSaved] = useState(false);
  const [visionInput, setVisionInput] = useState("");
  const [valuesInput, setValuesInput] = useState("");
  const [missionInput, setMissionInput] = useState("");
  const [showVisionDropdown, setShowVisionDropdown] = useState(false);
  const [showValuesDropdown, setShowValuesDropdown] = useState(false);
  const [showMissionDropdown, setShowMissionDropdown] = useState(false);
  const [buttonVisionLabel, setVisionButtonLabel] = useState("Add");
  const [buttonValuesLabel, setValuesButtonLabel] = useState("Add");
  const [buttonMissionLabel, setMissionButtonLabel] = useState("Add");
  const [textareaDisabled, setTextareaDisabled] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState(null);
  const [newStrategyValue, setNewStrategyValue] = useState("");

  // @ts-ignore
  const handleEditClick = (strategy) => {
    setEditingStrategy(strategy);
    setNewStrategyValue(strategy.value);
  };

  const [strategies, setStrategies] = useState<StrategyCategories>({
    financial: [],
    stakeholder: [],
    internalProcess: [],
    learningGrowth: [],
  });

  const [selectedPerspective, setSelectedPerspective] = useState("financial");

  const handleTextareaChange = (
    setStateFunction: React.Dispatch<React.SetStateAction<string>>,
    event: ChangeEvent<HTMLTextAreaElement>
  ) => {
    setStateFunction(event.target.value);
  };

  const toggleDropdown = (section: string) => {
    switch (section) {
      case "vision":
        setShowVisionDropdown(!showVisionDropdown);
        break;
      case "values":
        setShowValuesDropdown(!showValuesDropdown);
        break;
      case "mission":
        setShowMissionDropdown(!showMissionDropdown);
        break;
      default:
        break;
    }
  };

  const handleMoreClick = (section: string) => {
    toggleDropdown(section);
  };

  const handleAddClick = (
    section: string,
    setButtonLabel: React.Dispatch<React.SetStateAction<string>>,
    setTextareaDisabled: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    toggleDropdown(section);
    switch (section) {
      case "vision":
        setShowVisionCard(true);
        setVisionSaved(false);
        setVisionButtonLabel("Save");
        setTextareaDisabled(false);
        break;
      case "values":
        setShowValuesCard(true);
        setValuesSaved(false);
        setValuesButtonLabel("Save");
        setTextareaDisabled(false);
        break;
      case "mission":
        setShowMissionCard(true);
        setMissionSaved(false);
        setMissionButtonLabel("Save");
        setTextareaDisabled(false);
        break;
      default:
        break;
    }
  };

  const handleVisionSaveClick = (
    setStateFunction: React.Dispatch<React.SetStateAction<boolean>>,
    setButtonLabel: React.Dispatch<React.SetStateAction<string>>,
    setTextareaDisabled: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setStateFunction(true);
    setVisionButtonLabel("Edit");
    setTextareaDisabled(true);
  };

  const handleValuesSaveClick = (
    setStateFunction: React.Dispatch<React.SetStateAction<boolean>>,
    setButtonLabel: React.Dispatch<React.SetStateAction<string>>,
    setTextareaDisabled: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setStateFunction(true);
    setValuesButtonLabel("Edit");
    setTextareaDisabled(true);
  };

  const handleMissionSaveClick = (
    setStateFunction: React.Dispatch<React.SetStateAction<boolean>>,
    setButtonLabel: React.Dispatch<React.SetStateAction<string>>,
    setTextareaDisabled: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setStateFunction(true);
    setMissionButtonLabel("Edit");
    setTextareaDisabled(true);
  };

  const handleVisionDeleteClick = (section: string) => {
    toggleDropdown(section);
  };

  const handleValuesDeleteClick = (section: string) => {
    toggleDropdown(section);
  };

  const handleMissionDeleteClick = (section: string) => {
    toggleDropdown(section);
  };

  const handleFinancialSaveEdit = async (
    fID: number,
    office_target: string,
    department_id: number
  ) => {
    try {
      const details = {
        office_target: office_target,
        department: { id: department_id }, // Include the department ID in the payload
      };
      const response = await fetch(
        `http://localhost:8080/stratmap/financial/edit/${fID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(details),
        }
      );

      if (!response.ok) {
        console.error("Failed to update strategy");
        return;
      }

      const result = await response.json();
      const updatedStrategy = result.updatedFinancial;

      setStrategies((prevStrategies) => {
        const newStrategies = { ...prevStrategies };
        const financial = newStrategies.financial || [];
        console.log(`updatedStrategy for fID ${fID}:`, updatedStrategy);

        if (updatedStrategy) {
          const strategyIndex = financial.findIndex(
            (strategy) => strategy.id === fID
          );
          if (strategyIndex !== -1) {
            financial[strategyIndex] = updatedStrategy;
            newStrategies.financial = financial;
          } else {
            console.error(`Strategy with id ${fID} not found`);
          }
        } else {
          console.error(`updatedStrategy for fID ${fID} is undefined`);
        }

        return newStrategies;
      });
    } catch (error) {
      console.error("An error occurred while updating the strategy:", error);
    }
  };

  const handleLearningGrowthSaveEdit = async (
    fID: number,
    office_target: string,
    department_id: number
  ) => {
    try {
      const details = {
        office_target: office_target,
        department: { id: department_id }, // Include the department ID in the payload
      };
      const response = await fetch(
        `http://localhost:8080/stratmap/learning/edit/${fID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(details),
        }
      );

      if (!response.ok) {
        console.error("Failed to update strategy");
        return;
      }

      const result = await response.json();
      const updatedStrategy = result.updatedLG;

      setStrategies((prevStrategies) => {
        const newStrategies = { ...prevStrategies };
        const learningGrowth = newStrategies.learningGrowth || [];
        console.log(`updatedStrategy for fID ${fID}:`, updatedStrategy);

        if (updatedStrategy) {
          const strategyIndex = learningGrowth.findIndex(
            (strategy) => strategy.id === fID
          );
          if (strategyIndex !== -1) {
            learningGrowth[strategyIndex] = updatedStrategy;
            newStrategies.learningGrowth = learningGrowth;
          } else {
            console.error(`Strategy with id ${fID} not found`);
          }
        } else {
          console.error(`updatedStrategy for fID ${fID} is undefined`);
        }

        return newStrategies;
      });

      fetchExistingStrategies(department_id);
    } catch (error) {
      console.error("An error occurred while updating the strategy:", error);
    }
  };

  const handleStakeholderSaveEdit = async (
    fID: number,
    office_target: string,
    department_id: number
  ) => {
    try {
      const details = {
        office_target: office_target,
        department: { id: department_id }, // Include the department ID in the payload
      };
      const response = await fetch(
        `http://localhost:8080/stratmap/stakeholder/edit/${fID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(details),
        }
      );

      if (!response.ok) {
        console.error("Failed to update strategy");
        return;
      }

      const result = await response.json();
      const updatedStrategy = result.stakeholderUpdated;

      setStrategies((prevStrategies) => {
        const newStrategies = { ...prevStrategies };
        const stakeholder = newStrategies.stakeholder || [];
        console.log(`updatedStrategy for fID ${fID}:`, updatedStrategy);

        if (updatedStrategy) {
          const strategyIndex = stakeholder.findIndex(
            (strategy) => strategy.id === fID
          );
          if (strategyIndex !== -1) {
            stakeholder[strategyIndex] = updatedStrategy;
            newStrategies.stakeholder = stakeholder;
          } else {
            console.error(`Strategy with id ${fID} not found`);
          }
        } else {
          console.error(`updatedStrategy for fID ${fID} is undefined`);
        }

        return newStrategies;
      });

      fetchExistingStrategies(department_id);
    } catch (error) {
      console.error("An error occurred while updating the strategy:", error);
    }
  };

  const handleInternalProcessSaveEdit = async (
    fID: number,
    office_target: string,
    department_id: number) => {
    try {
      const details = {
        office_target: office_target,
        department: { id: department_id }, // Include the department ID in the payload
      };
      const response = await fetch(`http://localhost:8080/stratmap/internal/edit/${fID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(details),
      });

      if (!response.ok) {
        console.error("Failed to update strategy");
        return;
      }

      const result = await response.json();
      const updatedStrategy = result.updatedIP;

      setStrategies((prevStrategies) => {
        const newStrategies = { ...prevStrategies };
        const internalProcess = newStrategies.internalProcess || [];
        console.log(`updatedStrategy for fID ${fID}:`, updatedStrategy);

        if (updatedStrategy) {
          const strategyIndex = internalProcess.findIndex(
            (strategy) => strategy.id === fID
          );
          if (strategyIndex !== -1) {
            internalProcess[strategyIndex] = updatedStrategy;
            newStrategies.internalProcess = internalProcess;
          } else {
            console.error(`Strategy with id ${fID} not found`);
          }
        } else {
          console.error(`updatedStrategy for fID ${fID} is undefined`);
        }

        return newStrategies;
      });

      fetchExistingStrategies(department_id);
    } catch (error) {
      console.error("An error occurred while updating the strategy:", error);
    }
  };

  const API_ENDPOINTS = [
    "/api/stratmap/getStRows",
    "/api/stratmap/getSoRows",
    "/api/stratmap/getWtRows",
    "/api/stratmap/getWoRows",
  ];

  const SYSTEM_PROMPT = `Categorize the following responses into the following categories:
      1. Financial: Stewardship
      2. Stakeholder: Client Relationship
      3. Internal Process: Process Development & Technology Management
      4. Learning & Growth: Culture & People Development
      
    Remove any existing numbering or labeling in the responses namely the returned number from the database. Add the corresponding number and only the number from the categories above at the beginning of each line (only choose from 1-4). Do not modify the original response text. Do not add any markups. If the response is blank, write "Field is blank" for that response.
    `;

  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=AIzaSyATO5xndEGhEgXrHdeYLOiTbZqtUwYuZqE`;

  // financial
  const [isFModalOpen, setIsFModalOpen] = useState(false);
  const [newFStrategy, setNewFStrategy] = useState("");
  const [newFTargetCode, setNewFTargetCode] = useState("");
  const [savedFStrategies, setSavedFStrategies] = useState<string[]>([]);

  const openFModal = () => {
    setIsFModalOpen(true);
    setNewFTargetCode("");
    setNewFStrategy("");
  };

  const closeFModal = () => {
    setNewFTargetCode("");
    setIsFModalOpen(false);
  };

  const handleFSave = async () => {
    const strategyFWithCode = `${newFTargetCode}: ${newFStrategy}`;

    try {
      const data = {
        office_target: newFStrategy,
        department: { id: department_id },
      };
      const response = await fetch(
        "http://localhost:8080/stratmap/financial/insert",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        closeFModal();
      } else {
        console.error("Error saving financial strategy");
        // Handle error
      }
    } catch (error) {
      console.error("Error saving financial strategy:", error);
      // Handle error
    }
    setSavedFStrategies([...savedFStrategies, strategyFWithCode]);
  };

  // stakeholder
  const [isSModalOpen, setIsSModalOpen] = useState(false);
  const [newSStrategy, setNewSStrategy] = useState("");
  const [newSTargetCode, setNewSTargetCode] = useState("");
  const [savedSStrategies, setSavedSStrategies] = useState<string[]>([]);

  const openSModal = () => {
    setIsSModalOpen(true);
    setNewSTargetCode("");
    setNewSStrategy("");
  };

  const closeSModal = () => {
    setNewSTargetCode("");
    setIsSModalOpen(false);
  };

  const handleSSave = async () => {
    const strategySWithCode = `${newSTargetCode}: ${newSStrategy}`;

    try {
      const data = {
        office_target: newSStrategy,
        department: { id: department_id },
      };
      const response = await fetch(
        "http://localhost:8080/stratmap/stakeholder/insert",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        closeSModal();
      } else {
        console.error("Error saving stakeholder strategy");
        // Handle error
      }
    } catch (error) {
      console.error("Error saving stakeholder strategy:", error);
      // Handle error
    }
    setSavedSStrategies([...savedSStrategies, strategySWithCode]);
  };

  // internal process
  const [isIPModalOpen, setIsIPModalOpen] = useState(false);
  const [newIPStrategy, setNewIPStrategy] = useState("");
  const [newIPTargetCode, setNewIPTargetCode] = useState("");
  const [savedIPStrategies, setSavedIPStrategies] = useState<string[]>([]);

  const openIPModal = () => {
    setIsIPModalOpen(true);
    setNewIPTargetCode("");
    setNewIPStrategy("");
  };

  const closeIPModal = () => {
    setNewIPTargetCode("");
    setIsIPModalOpen(false);
  };

  const handleIPSave = async () => {
    const strategyIPWithCode = `${newIPTargetCode}: ${newIPStrategy}`;

    try {
      const data = {
        office_target: newIPStrategy,
        department: { id: department_id },
      };
      const response = await fetch(
        "http://localhost:8080/stratmap/internal/insert",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        closeIPModal();
      } else {
        console.error("Error saving internal process strategy");
        // Handle error
      }
    } catch (error) {
      console.error("Error saving internal process strategy:", error);
      // Handle error
    }
    setSavedSStrategies([...savedIPStrategies, strategyIPWithCode]);
  };

  // learning&growth
  const [isLGModalOpen, setIsLGModalOpen] = useState(false);
  const [newLGStrategy, setNewLGStrategy] = useState("");
  const [newLGTargetCode, setNewLGTargetCode] = useState("");
  const [savedLGStrategies, setSavedLGStrategies] = useState<string[]>([]);

  const openLGModal = () => {
    setIsLGModalOpen(true);
    setNewLGTargetCode("");
    setNewLGStrategy("");
  };

  const closeLGModal = () => {
    setNewLGTargetCode("");
    setIsLGModalOpen(false);
  };

  const handleLGSave = async () => {
    const strategyLGWithCode = `${newLGTargetCode}: ${newLGStrategy}`;

    try {
      const data = {
        office_target: newLGStrategy,
        department: { id: department_id },
      };
      const response = await fetch(
        "http://localhost:8080/stratmap/learning/insert",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        closeIPModal();
      } else {
        console.error("Error saving learning growth strategy");
        // Handle error
      }
    } catch (error) {
      console.error("Error saving learning growth strategy:", error);
      // Handle error
    }
    setSavedFStrategies([...savedLGStrategies, strategyLGWithCode]);
  };

  const fetchDataAndCategorize = async (apiEndpoint: string) => {
    try {
      const response = await fetch(apiEndpoint);
      const data = await response.json();
      const responses = data.rows;
      console.log("Responses: ", responses);
      const inputText = responses
        .map((row: ResponseRow) => `${row["s-tResponses"]}`)
        .join("\n");
      const geminiResponse = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: `${SYSTEM_PROMPT}\n${inputText}` }],
            },
          ],
        }),
      });
      const geminiData = await geminiResponse.json();
      const apiResponse =
        geminiData.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response received";
      console.log(apiResponse);
      const generatedSentences: string[] = apiResponse
        .split("\n")
        .filter((sentence: string) => sentence.trim() !== "");
      const categorizedSentences: GeneratedSentence[] =
        generatedSentences.reduce((acc, sentence) => {
          const parts = sentence.split(". ");
          if (parts.length === 2) {
            const prefix = parts[0];
            const content = parts[1];
            const id = parseInt(prefix);
            if (!isNaN(id) && id >= 1 && id <= 4) {
              // @ts-ignore
              acc.push({ id, value: content });
            } else {
              console.warn("Unexpected prefix:", prefix);
            }
          } else {
            console.warn("Invalid sentence format:", sentence);
          }
          return acc;
        }, []);
      return categorizedSentences;
    } catch (error) {
      console.error(
        `Error fetching data or processing Gemini response for ${apiEndpoint}:`,
        error
      );
      return []; // Return an empty array on error
    }
  };

  const fetchAllData = async (department_id: number) => {
    const promises = API_ENDPOINTS.map((apiEndpoint) =>
      fetchDataAndCategorize(apiEndpoint)
    );
    const categorizedSentencesArrays = await Promise.all(promises);

    const strategies = {
      financial: [] as GeneratedSentence[],
      stakeholder: [] as GeneratedSentence[],
      internalProcess: [] as GeneratedSentence[],
      learningGrowth: [] as GeneratedSentence[],
    };

    for (const categorizedSentences of categorizedSentencesArrays) {
      for (const sentence of categorizedSentences) {
        switch (sentence.id) {
          case 1:
            strategies.financial.push(sentence);
            break;
          case 2:
            strategies.stakeholder.push(sentence);
            break;
          case 3:
            strategies.internalProcess.push(sentence);
            break;
          case 4:
            strategies.learningGrowth.push(sentence);
            break;
        }
      }
    }
    setStrategies(strategies);

    const saveToDatabase = async (
      strategies: {
        financial: GeneratedSentence[];
        stakeholder: GeneratedSentence[];
        internalProcess: GeneratedSentence[];
        learningGrowth: GeneratedSentence[];
      },
      department_id: number
    ) => {
      try {
        // Financial entity
        const financialPromises = strategies.financial.map((sentence) => {
          const data = {
            office_target: sentence.value,
            department: { id: department_id },
          };
          console.log("financial data: ", data);
          return fetch("http://localhost:8080/stratmap/financial/insert", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
        });
        await Promise.all(financialPromises);

        // Stakeholder entity
        const stakeholderPromises = strategies.stakeholder.map((sentence) => {
          const data = {
            office_target: sentence.value,
            department: { id: department_id },
          };
          return fetch("http://localhost:8080/stratmap/stakeholder/insert", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
        });
        await Promise.all(stakeholderPromises);

        // Internal process entity
        const internalProcessPromises = strategies.internalProcess.map(
          (sentence) => {
            const data = {
              office_target: sentence.value,
              department: { id: department_id },
            };
            return fetch("http://localhost:8080/stratmap/internal/insert", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            });
          }
        );
        await Promise.all(internalProcessPromises);

        // Learning and growth entity
        const learningGrowthPromises = strategies.learningGrowth.map(
          (sentence) => {
            const data = {
              office_target: sentence.value,
              department: { id: department_id },
            };
            return fetch("http://localhost:8080/stratmap/learning/insert", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            });
          }
        );
        await Promise.all(learningGrowthPromises);

        console.log("Data saved to database");
      } catch (error) {
        console.error("Error saving data to database:", error);
      }
    };

    if (department_id) {
      await saveToDatabase(strategies, department_id);
    } else {
      console.error("Department ID not found in user data. Cannot save data.");
    }
  };

  const fetchExistingStrategies = async (department_id: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/stratmap/byDepartment/${department_id}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      console.log("data: ", data);

      const strategies = {
        financial: data.financial.map((item: any) => ({
          id: 1,
          fID: item.id,
          value: item.office_target,
        })),
        stakeholder: data.stakeholder.map((item: any) => ({
          id: 2,
          fID: item.id,
          value: item.office_target,
        })),
        internalProcess: data.internalProcess.map((item: any) => ({
          id: 3,
          fID: item.id,
          value: item.office_target,
        })),
        learningGrowth: data.learningGrowth.map((item: any) => ({
          id: 4,
          fID: item.id,
          value: item.office_target,
        })),
      };

      setStrategies(strategies);
      console.log(strategies);
    } catch (error) {
      console.error("Error fetching existing strategies:", error);
    }
  };

  const handleDeleteClick = {};

  const handleFinancialDelete = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/stratmap/financial/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const updatedStrategies = strategies.financial.filter(
          (strategy) => strategy.id !== id
        );
        setStrategies({ ...strategies, financial: updatedStrategies });
        fetchExistingStrategies(department_id);
      } else {
        console.error("Failed to delete financial strategy");
      }
    } catch (error) {
      console.error("Error deleting financial strategy:", error);
    }
  };

  const handleLGDelete = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/stratmap/learning/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const updatedStrategies = strategies.learningGrowth.filter(
          (strategy) => strategy.id !== id
        );
        setStrategies({ ...strategies, learningGrowth: updatedStrategies });
        fetchExistingStrategies(department_id);
      } else {
        console.error("Failed to delete financial strategy");
      }
    } catch (error) {
      console.error("Error deleting financial strategy:", error);
    }
  };

  const handleStakeholderDelete = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/stratmap/stakeholder/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const updatedStrategies = strategies.stakeholder.filter(
          (strategy) => strategy.id !== id
        );
        setStrategies({ ...strategies, stakeholder: updatedStrategies });
        fetchExistingStrategies(department_id);
      } else {
        console.error("Failed to delete financial strategy");
      }
    } catch (error) {
      console.error("Error deleting financial strategy:", error);
    }
  };

  const handleInternalDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/stratmap/internal/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const updatedStrategies = strategies.internalProcess.filter(
          (strategy) => strategy.id !== id
        );
        setStrategies({ ...strategies, internalProcess: updatedStrategies });
        fetchExistingStrategies(department_id);
      } else {
        console.error("Failed to delete financial strategy");
      }
    } catch (error) {
      console.error("Error deleting financial strategy:", error);
    }
  };

  const checkGeneratedAiStrats = async (username: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/user/get/${username}`
      ); // Assuming you have a route to fetch user data
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const userData = await response.json();
      console.log("userData: ", userData.generatedAiStrat);

      if (userData.generatedAiStrats === 1) {
        await fetchExistingStrategies(department_id);
      } else if (
        userData.generatedAiStrats === 0 ||
        userData.generatedAiStrats === null
      ) {
        await updateGeneratedAiStrats(username);
        await fetchAllData(department_id);
      }
    } catch (error) {
      console.error("Error checking generatedAiStrats:", error);
    }
  };

  const updateGeneratedAiStrats = async (username: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/user/get/${username}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const userData = await response.json();

      if (userData.generatedAiStrats === 0) {
        // Update generatedAiStrats to 1
        const updateResponse = await fetch(
          `http://localhost:8080/user/update/${username}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ generatedAiStrats: 1 }),
          }
        );

        if (!updateResponse.ok) {
          throw new Error(`HTTP error! Status: ${updateResponse.status}`);
        }
      }
    } catch (error) {
      console.error("Error updating generatedAiStrats:", error);
    }
  };

  return (
    <div className="flex flex-row w-full bg-[#eeeeee]">
      <Navbar />
      <div className="flex-1 h-screen">
        <div className="flex-1 flex flex-col mt-8 ml-80">
          {/* Strategy Mapping container */}
          <span className="break-words font-bold text-[3rem] text-[#000000]">
            Strategy Mapping
          </span>
          <div className="mt-8 grid grid-cols-3">
            <div className="col-span-3">
              <div className="break-words font font-normal text-[1.3rem] text-[#504C4C] mb-16 mt-[-1rem]">
                Strategy mapping empowers organizations to translate their
                vision into actionable strategies, align resources, and drive
                performance across all aspects of the business. Navigate
                complexity, capitalize on opportunities, and achieve sustainable
                growth in today&apos;s dynamic business landscape.
              </div>
              {/* perspectives toggle */}
              <div className=" flex flex-row self-start box-sizing-border mt-5 mb-5">
                <div
                  className="flex flex-row box-sizing-border mr-10"
                  onClick={() => setSelectedPerspective("financial")}
                >
                  <div className="inline-block break-words font-bold text-[1.3rem] text-[#807C7C] cursor-pointer pb-1.5 transition-all hover:font-extrabold hover:underline hover:text-[#000000]">
                    FINANCIAL
                  </div>
                </div>
                <div
                  className="flex flex-row box-sizing-border mr-10"
                  onClick={() => setSelectedPerspective("stakeholder")}
                >
                  <div className="inline-block break-words font-bold text-[1.3rem] text-[#807C7C] cursor-pointer pb-1.5 transition-all hover:font-extrabold hover:underline hover:text-[#000000]">
                    STAKEHOLDER
                  </div>
                </div>
                <div
                  className="flex flex-row box-sizing-border mr-10"
                  onClick={() => setSelectedPerspective("internalProcess")}
                >
                  <div className="inline-block break-words font-bold text-[1.3rem] text-[#807C7C] cursor-pointer pb-1.5 transition-all hover:font-extrabold hover:underline hover:text-[#000000]">
                    INTERNAL PROCESS
                  </div>
                </div>
                <div
                  className="flex flex-row box-sizing-border"
                  onClick={() => setSelectedPerspective("learningGrowth")}
                >
                  <div className="inline-block break-words font-bold text-[1.3rem] text-[#807C7C] cursor-pointer pb-1.5 transition-all hover:font-extrabold hover:underline hover:text-[#000000]">
                    LEARNING & GROWTH
                  </div>
                </div>
              </div>
              {/* end of perspectives toggle */}

              {/* main container */}
              <div className="shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)] border border-gray-300 bg-[#FFFFFF] relative mr-10 flex flex-col pt-4 pr-5 pl-5 w-[98%] h-auto mb-10 rounded-lg">
                {selectedPerspective === "financial" && (
                  <div className="flex flex-col align-middle items-center justify-center relative w-[100%]">
                    <div className=" mt-5 inline-block self-center break-words font-bold text-[1.3rem] text-[#000000]">
                      Financial : Stewardship
                    </div>
                    {/* add button here */}
                    <button onClick={openFModal} className="flex flex-row">
                      <div className="text-[#EFAF21] mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-8 h-8"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="mt-1">Add more strategies</div>
                    </button>
                    {isFModalOpen && (
                      <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <div className="bg-white p-8 rounded-lg z-10 h-[29rem] w-[70rem]">
                          <div className="flex flex-row">
                            <h2 className="text-2xl mb-5 font-semibold">
                              Financial Strategy
                            </h2>
                            <button
                              onClick={closeFModal}
                              className="ml-[51rem] mt-[-4rem] text-gray-500 hover:text-gray-700"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-6 h-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                          <div className="flex flex-col">
                            <span className="mr-3 mb-2 break-words font-regular text-md text-[#000000]">
                              Target Code
                              <span className="text-[#DD1414]">*</span>
                            </span>
                          </div>
                          <input
                            type="text"
                            value={newFTargetCode}
                            onChange={(e) => setNewFTargetCode(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 mb-4"
                          />
                          <div className="flex flex-col">
                            <span className="mr-3 mb-2 break-words font-regular text-md text-[#000000]">
                              Strategy
                              <span className="text-[#DD1414]">*</span>
                            </span>
                            <textarea
                              value={newFStrategy}
                              onChange={(e) => setNewFStrategy(e.target.value)}
                              className="border border-gray-300 pl-2 pr-2 rounded-lg w-[66rem] h-[10rem]"
                            />
                          </div>
                          <div className="flex flex-row justify-center mt-2 gap-10">
                            <button
                              onClick={closeFModal}
                              className="bg-[#8A252C] text-[#ffffff] font-semibold hover:bg-[#a8444b] hover:text-[#ffffff] px-4 py-2 mt-4 rounded-lg w-40"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleFSave}
                              className="bg-[#eec160] text-[#8A252C] font-semibold hover:bg-[#f8d384] hover:text-[#8A252C] px-4 py-2 mt-4 rounded-lg w-40"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="bg-[#ffffff] mt-5 w-[100%] h-auto flex flex-col pt-4 pr-3 pb-6 box-sizing-border rounded-lg mb-10 border border-yellow-500 overflow-y-auto overflow-x-hidden">
                      {strategies.financial.map(
                        (strategy: GeneratedSentence) => (
                          <div
                            key={strategy.id}
                            className="bg-[#ffffff] mr-8 flex flex-row pt-4 pr-5 pb-4 w-[100%] h-auto box-sizing-border"
                          >
                            {/* edit div */}
                            {editingStrategy === strategy ? (
                              <div className="mt-[-0.6rem] pr-3 pl-3 w-[100%] h-10 flex">
                                <input
                                  type="text"
                                  value={newStrategyValue}
                                  onChange={(e) =>
                                    setNewStrategyValue(e.target.value)
                                  }
                                  className="w-full"
                                />
                                <button
                                  onClick={() =>
                                    handleFinancialSaveEdit(
                                      // @ts-ignore
                                      strategy.fID,
                                      newStrategyValue,
                                      department_id
                                    )
                                  }
                                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
                                >
                                  Save
                                </button>
                              </div>
                            ) : (
                              <div className="mt-[-0.6rem] pr-3 pl-3 w-[100%] h-10">
                                {strategy.value}
                              </div>
                            )}
                            <div className="flex">
                              <button
                                onClick={() => handleEditClick(strategy)}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  handleFinancialDelete(strategy.fID)
                                }
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {selectedPerspective === "learningGrowth" && (
                  // LEARNING & GROWTH
                  <div className="flex flex-col align-middle items-center justify-center relative w-[100%]">
                    <div className=" mt-5 inline-block self-center break-words font-bold text-[1.3rem] text-[#000000]">
                      Learning & Growth : Culture & People Development
                    </div>
                    <button onClick={openLGModal} className="flex flex-row">
                      <div className="text-[#EFAF21] mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-8 h-8"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="mt-1">Add more strategies</div>
                    </button>
                    {isLGModalOpen && (
                      <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <div className="bg-white p-8 rounded-lg z-10 h-[29rem] w-[70rem]">
                          <div className="flex flex-row">
                            <h2 className="text-2xl mb-5 font-semibold">
                              Learning & Growth Strategy
                            </h2>
                            <button
                              onClick={closeLGModal}
                              className="ml-[44rem] mt-[-4rem] text-gray-500 hover:text-gray-700"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-6 h-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                          <div className="flex flex-col">
                            <span className="mr-3 mb-2 break-words font-regular text-md text-[#000000]">
                              Target Code
                              <span className="text-[#DD1414]">*</span>
                            </span>
                          </div>
                          <input
                            type="text"
                            value={newLGTargetCode}
                            onChange={(e) => setNewLGTargetCode(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 mb-4"
                          />
                          <div className="flex flex-col">
                            <span className="mr-3 mb-2 break-words font-regular text-md text-[#000000]">
                              Strategy
                              <span className="text-[#DD1414]">*</span>
                            </span>
                            <textarea
                              value={newLGStrategy}
                              onChange={(e) => setNewLGStrategy(e.target.value)}
                              className="border border-gray-300 pl-2 pr-2 rounded-lg w-[66rem] h-[10rem]"
                            />
                          </div>
                          <div className="flex flex-row justify-center mt-2 gap-10">
                            <button
                              onClick={closeLGModal}
                              className="bg-[#8A252C] text-[#ffffff] font-semibold hover:bg-[#a8444b] hover:text-[#ffffff] px-4 py-2 mt-4 rounded-lg w-40"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleLGSave}
                              className="bg-[#eec160] text-[#8A252C] font-semibold hover:bg-[#f8d384] hover:text-[#8A252C] px-4 py-2 mt-4 rounded-lg w-40"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="bg-[#ffffff] mt-5 w-[100%] h-auto flex flex-col pt-4 pr-3 pb-6 box-sizing-border rounded-lg mb-10 border border-yellow-500 overflow-y-auto overflow-x-hidden">
                      {strategies.learningGrowth.map(
                        (strategy: GeneratedSentence) => (
                          <div
                            key={strategy.id}
                            className="bg-[#ffffff] relative mr-8 flex flex-row pt-4 pr-5 pb-4 w-[100%] h-auto box-sizing-border"
                          >
                            {editingStrategy === strategy ? (
                              <div className="mt-[-0.6rem] pr-3 pl-3 w-[100%] h-10 flex">
                                <input
                                  type="text"
                                  value={newStrategyValue}
                                  onChange={(e) =>
                                    setNewStrategyValue(e.target.value)
                                  }
                                  className="w-full"
                                />
                                <button
                                  onClick={() =>
                                    handleLearningGrowthSaveEdit(
                                      // @ts-ignore
                                      strategy.fID,
                                      newStrategyValue,
                                      department_id
                                    )
                                  }
                                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
                                >
                                  Save
                                </button>
                              </div>
                            ) : (
                              <div className="mt-[-0.6rem] pr-3 pl-3 w-[100%] h-10">
                                {strategy.value}
                              </div>
                            )}
                            <div className="flex">
                              <button
                                onClick={() => handleEditClick(strategy)}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleLGDelete(strategy.fID)}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {selectedPerspective === "internalProcess" && (
                  // INTERNAL PROCESS
                  <div className="flex flex-col align-middle items-center justify-center relative w-[100%]">
                    <div className=" mt-5 inline-block self-center break-words font-bold text-[1.3rem] text-[#000000]">
                      Internal Process : Process Development & Technology
                      Management
                    </div>
                    <button onClick={openIPModal} className="flex flex-row">
                      <div className="text-[#EFAF21] mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-8 h-8"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="mt-1">Add more strategies</div>
                    </button>
                    {isIPModalOpen && (
                      <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <div className="bg-white p-8 rounded-lg z-10 h-[29rem] w-[70rem]">
                          <div className="flex flex-row">
                            <h2 className="text-2xl mb-5 font-semibold">
                              Internal Process Strategy
                            </h2>
                            <button
                              onClick={closeIPModal}
                              className="ml-[46rem] mt-[-4rem] text-gray-500 hover:text-gray-700"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-6 h-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                          <div className="flex flex-col">
                            <span className="mr-3 mb-2 break-words font-regular text-md text-[#000000]">
                              Target Code
                              <span className="text-[#DD1414]">*</span>
                            </span>
                          </div>
                          <input
                            type="text"
                            value={newIPTargetCode}
                            onChange={(e) => setNewIPTargetCode(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 mb-4"
                          />
                          <div className="flex flex-col">
                            <span className="mr-3 mb-2 break-words font-regular text-md text-[#000000]">
                              Strategy
                              <span className="text-[#DD1414]">*</span>
                            </span>
                            <textarea
                              value={newIPStrategy}
                              onChange={(e) => setNewIPStrategy(e.target.value)}
                              className="border border-gray-300 pl-2 pr-2 rounded-lg w-[66rem] h-[10rem]"
                            />
                          </div>
                          <div className="flex flex-row justify-center mt-2 gap-10">
                            <button
                              onClick={closeIPModal}
                              className="bg-[#8A252C] text-[#ffffff] font-semibold hover:bg-[#a8444b] hover:text-[#ffffff] px-4 py-2 mt-4 rounded-lg w-40"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleIPSave}
                              className="bg-[#eec160] text-[#8A252C] font-semibold hover:bg-[#f8d384] hover:text-[#8A252C] px-4 py-2 mt-4 rounded-lg w-40"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="bg-[#ffffff] mt-5 w-[100%] h-auto flex flex-col pt-4 pr-3 pb-6 box-sizing-border rounded-lg mb-10 border border-yellow-500 overflow-y-auto overflow-x-hidden">
                      {strategies.internalProcess.map(
                        (strategy: GeneratedSentence) => (
                          <div
                            key={strategy.id}
                            className="bg-[#ffffff] relative mr-8 flex flex-row pt-4 pr-5 pb-4 w-[100%] h-auto box-sizing-border"
                          >
                            {editingStrategy === strategy ? (
                              <div className="mt-[-0.6rem] pr-3 pl-3 w-[100%] h-10 flex">
                                <input
                                  type="text"
                                  value={newStrategyValue}
                                  onChange={(e) =>
                                    setNewStrategyValue(e.target.value)
                                  }
                                  className="w-full"
                                />
                                <button
                                  onClick={() =>
                                    // @ts-ignore
                                    handleInternalProcessSaveEdit(
                                    // @ts-ignore
                                    strategy.fID,
                                    newStrategyValue,
                                    department_id
                                    )
                                  }
                                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
                                >
                                  Save
                                </button>
                              </div>
                            ) : (
                              <div className="mt-[-0.6rem] pr-3 pl-3 w-[100%] h-10">
                                {strategy.value}
                              </div>
                            )}
                            <div className="flex">
                              <button
                                onClick={() => handleEditClick(strategy)}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  handleInternalDelete(strategy.fID)
                                }
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {selectedPerspective === "stakeholder" && (
                  // STAKEHOLDER
                  <div className="flex flex-col align-middle items-center justify-center relative w-[100%]">
                    <div className=" mt-5 inline-block self-center break-words font-bold text-[1.3rem] text-[#000000]">
                      Stakeholder : Client Relationship
                    </div>
                    <button onClick={openSModal} className="flex flex-row">
                      <div className="text-[#EFAF21] mr-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-8 h-8"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="mt-1">Add more strategies</div>
                    </button>
                    {isSModalOpen && (
                      <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <div className="bg-white p-8 rounded-lg z-10 h-[29rem] w-[70rem]">
                          <div className="flex flex-row">
                            <h2 className="text-2xl mb-5 font-semibold">
                              Stakeholder Strategy
                            </h2>
                            <button
                              onClick={closeSModal}
                              className="ml-[49rem] mt-[-4rem] text-gray-500 hover:text-gray-700"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-6 h-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                          <div className="flex flex-col">
                            <span className="mr-3 mb-2 break-words font-regular text-md text-[#000000]">
                              Target Code
                              <span className="text-[#DD1414]">*</span>
                            </span>
                          </div>
                          <input
                            type="text"
                            value={newSTargetCode}
                            onChange={(e) => setNewSTargetCode(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 mb-4"
                          />
                          <div className="flex flex-col">
                            <span className="mr-3 mb-2 break-words font-regular text-md text-[#000000]">
                              Strategy
                              <span className="text-[#DD1414]">*</span>
                            </span>
                            <textarea
                              value={newSStrategy}
                              onChange={(e) => setNewSStrategy(e.target.value)}
                              className="border border-gray-300 pl-2 pr-2 rounded-lg w-[66rem] h-[10rem]"
                            />
                          </div>
                          <div className="flex flex-row justify-center mt-2 gap-10">
                            <button
                              onClick={closeSModal}
                              className="bg-[#8A252C] text-[#ffffff] font-semibold hover:bg-[#a8444b] hover:text-[#ffffff] px-4 py-2 mt-4 rounded-lg w-40"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleSSave}
                              className="bg-[#eec160] text-[#8A252C] font-semibold hover:bg-[#f8d384] hover:text-[#8A252C] px-4 py-2 mt-4 rounded-lg w-40"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="bg-[#ffffff] mt-5 w-[100%] h-auto flex flex-col pt-4 pr-3 pb-6 box-sizing-border rounded-lg mb-10 border border-yellow-500 overflow-y-auto overflow-x-hidden">
                      {strategies.stakeholder.map(
                        (strategy: GeneratedSentence) => (
                          <div
                            key={strategy.id}
                            className="bg-[#ffffff] relative mr-8 flex flex-row pt-4 pr-5 pb-4 w-[100%] h-auto box-sizing-border"
                          >
                            {editingStrategy === strategy ? (
                              <div className="mt-[-0.6rem] pr-3 pl-3 w-[100%] h-10 flex">
                                <input
                                  type="text"
                                  value={newStrategyValue}
                                  onChange={(e) =>
                                    setNewStrategyValue(e.target.value)
                                  }
                                  className="w-full"
                                />
                                <button
                                  onClick={() =>
                                    handleStakeholderSaveEdit(
                                      // @ts-ignore
                                      strategy.fID,
                                      newStrategyValue,
                                      department_id
                                    )
                                  }
                                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
                                >
                                  Save
                                </button>
                              </div>
                            ) : (
                              <div className="mt-[-0.6rem] pr-3 pl-3 w-[100%] h-10">
                                {strategy.value}
                              </div>
                            )}
                            <div className="flex">
                              <button
                                onClick={() => handleEditClick(strategy)}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  handleStakeholderDelete(strategy.fID)
                                }
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
              {/* end of main container */}
            </div>

            {/* vision-values-mission container */}
            {/* <div className="col-span-1 flex justify-end hidden lg:flex">
              <div className="h-[72rem] border-l border-gray-300 mr-[2rem] mt-[-10rem]"></div>
              <div className="flex flex-col gap-[1.5rem] mt-[-6rem] mr-2">
                <div className="bg-[#ffffff] rounded-lg p-4 border border-gray-300 h-80 w-[30rem] shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)]">
                  <div className="rounded-t-lg bg-[#8A252C] p-2 flex items-center justify-between">
                    <span className="text-xl font-bold text-white">VISION</span>

                    <div className="relative">
                      <button
                        className="px-2 py-1 text-[#ffffff] rounded hover:bg-[#FAD655] text-xl font-bold"
                        onClick={() => handleMoreClick("vision")}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                          />
                        </svg>
                      </button>
                      {showVisionDropdown && (
                        <div
                          className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10`}
                        >
                          <div className="py-1">
                            <button
                              className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-red-500 w-full text-left"
                              onClick={() =>
                                handleAddClick("vision", setVisionButtonLabel, setTextareaDisabled)
                              }
                            >
                              {buttonVisionLabel}
                            </button>
                            <button
                              className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-red-500 w-full text-left"
                              onClick={() => handleVisionDeleteClick("vision")}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {showVisionCard && !visionSaved && (
                    <div className="bg-white rounded-lg p-1 h-60 w-[28rem]">
                      <textarea
                        className="w-full h-full px-4 py-2 rounded-lg focus:outline-none resize-none"
                        placeholder="Enter your input here"
                        value={visionInput}
                        onChange={(e) => handleTextareaChange(setVisionInput, e)}
                        disabled={textareaDisabled}
                      ></textarea>
                      <button
                        onClick={() =>
                          handleVisionSaveClick(
                            setVisionSaved,
                            setVisionButtonLabel,
                            setTextareaDisabled
                          )
                        }
                        className="flex mt-[-17.89rem] ml-[20rem] px-2 py-1 bg-white text-[#8A252C] rounded hover:bg-[#FAD655] text-xl font-medium"
                      >
                        Save
                      </button>
                    </div>
                  )}

                  {visionSaved && (
                    <div className="bg-white rounded-lg p-1 h-60 w-[28rem] overflow-auto">
                      <div className="break-words">{visionInput}</div>
                    </div>
                  )}
                </div>

                <div className="bg-[#ffffff] rounded-lg p-4 border border-gray-300 h-80 w-[30rem] shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)]">
                  <div className="rounded-t-lg bg-[#8A252C] p-2 flex items-center justify-between">
                    <span className="text-xl font-bold text-white">VALUES</span>

                    <div className="relative">
                      <button
                        className="px-2 py-1 text-[#ffffff] rounded hover:bg-[#FAD655] text-xl font-bold"
                        onClick={() => handleMoreClick("values")}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                          />
                        </svg>
                      </button>
                      {showValuesDropdown && (
                        <div
                          className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10`}
                        >
                          <div className="py-1">
                            <button
                              className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-red-500 w-full text-left"
                              onClick={() =>
                                handleAddClick("values", setValuesButtonLabel, setTextareaDisabled)
                              }
                            >
                              {buttonValuesLabel}
                            </button>
                            <button
                              className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-red-500 w-full text-left"
                              onClick={() => handleValuesDeleteClick("values")}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {showValuesCard && !valuesSaved && (
                    <div className="bg-white rounded-lg p-1 h-60 w-[28rem]">
                      <textarea
                        className="w-full h-full px-4 py-2 rounded-lg focus:outline-none resize-none"
                        placeholder="Enter your input here"
                        value={valuesInput}
                        onChange={(e) => handleTextareaChange(setValuesInput, e)}
                        disabled={textareaDisabled}
                      ></textarea>
                      <button
                        onClick={() =>
                          handleValuesSaveClick(
                            setValuesSaved,
                            setValuesButtonLabel,
                            setTextareaDisabled
                          )
                        }
                        className="flex mt-[-17.89rem] ml-[20rem] px-2 py-1 bg-white text-[#8A252C] rounded hover:bg-[#FAD655] text-xl font-medium"
                      >
                        Save
                      </button>
                    </div>
                  )}

                  {valuesSaved && (
                    <div className="bg-white rounded-lg p-1 h-60 w-[28rem] overflow-auto">
                      <div className="break-words">{valuesInput}</div>
                    </div>
                  )}
                </div>

                <div className="bg-[#ffffff] rounded-lg p-4 border border-gray-300 h-80 w-[30rem] shadow-[0rem_0.3rem_0.3rem_0rem_rgba(0,0,0,0.25)]">
                  <div className="rounded-t-lg bg-[#8A252C] p-2 flex items-center justify-between">
                    <span className="text-xl font-bold text-white">MISSION</span>

                    <div className="relative">
                      <button
                        className="px-2 py-1 text-[#ffffff] rounded hover:bg-[#FAD655] text-xl font-bold"
                        onClick={() => handleMoreClick("mission")}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                          />
                        </svg>
                      </button>
                      {showMissionDropdown && (
                        <div
                          className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10`}
                        >
                          <div className="py-1">
                            <button
                              className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-red-500 w-full text-left"
                              onClick={() =>
                                handleAddClick(
                                  "mission",
                                  setMissionButtonLabel,
                                  setTextareaDisabled
                                )
                              }
                            >
                              {buttonMissionLabel}
                            </button>
                            <button
                              className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-red-500 w-full text-left"
                              onClick={() => handleMissionDeleteClick("mission")}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {showMissionCard && !missionSaved && (
                    <div className="bg-white rounded-lg p-1 h-60 w-[28rem]">
                      <textarea
                        className="w-full h-full px-4 py-2 rounded-lg focus:outline-none resize-none"
                        placeholder="Enter your input here"
                        value={missionInput}
                        onChange={(e) => handleTextareaChange(setMissionInput, e)}
                        disabled={textareaDisabled}
                      ></textarea>
                      <button
                        onClick={() =>
                          handleMissionSaveClick(
                            setMissionSaved,
                            setMissionButtonLabel,
                            setTextareaDisabled
                          )
                        }
                        className="flex mt-[-17.89rem] ml-[20rem] px-2 py-1 bg-white text-[#8A252C] rounded hover:bg-[#FAD655] text-xl font-medium"
                      >
                        Save
                      </button>
                    </div>
                  )}

                  {missionSaved && (
                    <div className="bg-white rounded-lg p-1 h-60 w-[28rem] overflow-auto">
                      <div className="break-words">{missionInput}</div>
                    </div>
                  )}
                </div>
              </div>
            </div> */}
            {/* end of vision value smission container */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
