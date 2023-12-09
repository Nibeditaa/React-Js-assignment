import React, { useState, useEffect } from "react";
import styled from "styled-components";

const KanbanBoardContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
`;

const KanbanBoardHeader = styled.div`
  width: 100%;
  height: 50px;
  background-color: #ccc;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const KanbanBoardBody = styled.div`
  width: 100%;
  height: calc(100vh - 100px);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`;

const KanbanBoardColumn = styled.div`
  width: 200px;
  height: 100%;
  background-color: #fff;
  margin: 10px;
  padding: 10px;
`;

const KanbanBoardTicket = styled.div`
  width: 100%;
  height: 50px;
  background-color: #fff;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  padding: 10px;
`;

const KanbanBoardButton = styled.button`
  width: 100px;
  height: 30px;
  background-color: #ccc;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  padding: 10px;
`;

const KanbanBoardDropdown = styled.select`
  width: 100px;
  height: 30px;
  background-color: #fff;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  padding: 10px;
`;

const KanbanBoardApp = () => {
  const [tickets, setTickets] = useState([]);
  const [groupingOption, setGroupingOption] = useState("status");
  const [sortingOption, setSortingOption] = useState("priority");

  useEffect(() => {
    fetch("https://api.quicksell.co/v1/internal/frontend-assignment")
      .then((response) => response.json())
      .then((data) => setTickets(data));
  }, []);

  const handleGroupingOptionChange = (event) => {
    setGroupingOption(event.target.value);
  };

  const handleSortingOptionChange = (event) => {
    setSortingOption(event.target.value);
  };

  const groupTickets = () => {
    switch (groupingOption) {
        case "status":
          return tickets.sort((ticket1, ticket2) => ticket1.status - ticket2.status);
        case "user":
          return tickets.sort((ticket1, ticket2) => ticket1.assignedUser - ticket2.assignedUser);
        case "priority":
          return tickets.sort((ticket1, ticket2) => ticket1.priority - ticket2.priority);
        case "team":
          return tickets.sort((ticket1, ticket2) => ticket1.team - ticket2.team);
        case "dueDate":
          return tickets.sort((ticket1, ticket2) => ticket1.dueDate - ticket2.dueDate);
      }
    };
  
    const sortTickets = () => {
      switch (sortingOption) {
        case "priority":
          return groupTickets().sort((ticket1, ticket2) => ticket2.priority - ticket1.priority);
          case "title":
            return groupTickets().sort((ticket1, ticket2) => ticket1.title.localeCompare(ticket2.title));
        }
      };
    
      const saveViewState = () => {
        localStorage.setItem("groupingOption", groupingOption);
        localStorage.setItem("sortingOption", sortingOption);
      };
    
      useEffect(() => {
        const savedGroupingOption = localStorage.getItem("groupingOption");
        const savedSortingOption = localStorage.getItem("sortingOption");
    
        if (savedGroupingOption) {
          setGroupingOption(savedGroupingOption);
        }
        if (savedSortingOption) {
          setSortingOption(savedSortingOption);
        }
      }, []);
    
      const renderTicket = (ticket) => {
        const priorityColor = {
          5: "red", // High
          4: "orange", // Urgent
          3: "yellow", // Medium
          2: "green", // Low
          1: "blue", // No priority
        };
    
        return (
          <KanbanBoardTicket key={ticket.id}>
            <div>
              <h3>{ticket.title}</h3>
              <p>{ticket.description}</p>
            </div>
            <div>
              <span style={{ color: priorityColor[ticket.priority] }}>
                Priority: {ticket.priorityLevel}
              </span>
              {ticket.assignedUser && (
                <span>Assigned to: {ticket.assignedUser}</span>
              )}
              {ticket.team && <span>Team: {ticket.team}</span>}
              {ticket.dueDate && <span>Due Date: {ticket.dueDate}</span>}
              <span>Status: {ticket.status}</span>
            </div>
          </KanbanBoardTicket>
        );
      };
    
      const renderColumn = (group) => {
        return (
          <KanbanBoardColumn key={group.name}>
            <h2>{group.name}</h2>
            {group.tickets.map((ticket) => renderTicket(ticket))}
          </KanbanBoardColumn>
        );
      };
    
      const renderBoard = () => {
        const groupedTickets = groupTickets();
        const groups = [];
    
        for (const group in groupedTickets) {
          groups.push({
            name: group,
            tickets: groupedTickets[group],
          });
        }
    
        return groups.map((group) => renderColumn(group));
      };
    
      return (
        <KanbanBoardContainer>
          <KanbanBoardHeader>
            <h1>Kanban Board</h1>
            <KanbanBoardButton onClick={saveViewState}>Display</KanbanBoardButton>
            <KanbanBoardDropdown
              value={groupingOption}
              onChange={handleGroupingOptionChange}
            >
              <option value="status">By Status</option>
              <option value="user">By User</option>
              <option value="priority">By Priority</option>
              <option value="team">By Team</option>
              <option value="dueDate">By Due Date</option>
            </KanbanBoardDropdown>
            <KanbanBoardDropdown
              value={sortingOption}
              onChange={handleSortingOptionChange}
            >
              <option value="priority">Priority</option>
              <option value="title">Title</option>
            </KanbanBoardDropdown>
          </KanbanBoardHeader>
          <KanbanBoardBody>{tickets.length > 0 ? renderBoard() : <p>Loading...</p>}</KanbanBoardBody>
        </KanbanBoardContainer>
      );
    };
    
    export default KanbanBoardApp;