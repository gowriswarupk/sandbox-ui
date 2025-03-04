import React from "react";
import ProcessorEdit from "./ProcessorEdit";
import { customRender, waitForI18n } from "@utils/testUtils";
import { fireEvent, RenderResult, waitFor } from "@testing-library/react";

const setupProcessorEdit = (): {
  comp: RenderResult;
  onSave: () => void;
  onCancel: () => void;
} => {
  const onSave = jest.fn();
  const onCancel = jest.fn();
  const comp = customRender(
    <ProcessorEdit
      onSave={onSave}
      onCancel={onCancel}
      isLoading={false}
      saveButtonLabel="Create"
    />
  );
  return { comp, onSave, onCancel };
};

describe("ProcessorEdit component", () => {
  it("should display processor type selection first", async () => {
    const { comp } = setupProcessorEdit();
    await waitForI18n(comp);

    await waitFor(() => {
      expect(comp.getByText("General information")).toBeInTheDocument();
    });

    expect(comp.queryByText("Source")).not.toBeInTheDocument();
    expect(comp.queryByText("Filters")).not.toBeInTheDocument();
    expect(comp.queryByText("Transformation")).not.toBeInTheDocument();
    expect(comp.queryByText("Action")).not.toBeInTheDocument();
  });

  it("should display specific form sections for source processors", async () => {
    const { comp } = setupProcessorEdit();
    await waitForI18n(comp);

    await waitFor(() => {
      expect(comp.getByText("General information")).toBeInTheDocument();
    });

    fireEvent.click(comp.getByText("Source processor"));

    expect(comp.queryByText("Source")).toBeInTheDocument();
    expect(comp.queryByText("Filters")).toBeInTheDocument();
    expect(comp.queryByText("Transformation")).toBeInTheDocument();
    expect(comp.queryByText("Action")).not.toBeInTheDocument();
  });

  it("should display specific form sections for sink processors", async () => {
    const { comp } = setupProcessorEdit();
    await waitForI18n(comp);

    await waitFor(() => {
      expect(comp.getByText("General information")).toBeInTheDocument();
    });

    fireEvent.click(comp.getByText("Sink processor"));

    expect(comp.queryByText("Source")).not.toBeInTheDocument();
    expect(comp.queryByText("Filters")).toBeInTheDocument();
    expect(comp.queryByText("Transformation")).toBeInTheDocument();
    expect(comp.queryByText("Action")).toBeInTheDocument();
  });

  it("should display custom save button", async () => {
    const saveButtonLabel = "Custom";
    const comp = customRender(
      <ProcessorEdit
        onSave={jest.fn}
        onCancel={jest.fn}
        isLoading={false}
        saveButtonLabel={saveButtonLabel}
      />
    );
    await waitForI18n(comp);

    expect(comp.queryByText(saveButtonLabel)).toBeInTheDocument();
  });

  it("should display the information of the passed processor and the processor type section", async () => {
    const name = "Processor name";
    const type = "sink";

    const comp = customRender(
      <ProcessorEdit
        onSave={jest.fn}
        onCancel={jest.fn}
        isLoading={false}
        processorTypeSection={
          <label data-testid="processor-type-label">{type}</label>
        }
        saveButtonLabel="Save"
        processor={{
          name,
          type,
        }}
      />
    );
    await waitForI18n(comp);

    expect(comp.baseElement.querySelector("#processor-name")).toHaveValue(name);
    expect(comp.getByTestId("processor-type-label")).toHaveTextContent(type);
  });

  it("handles filters addition and removal", async () => {
    const { comp } = setupProcessorEdit();
    await waitForI18n(comp);

    fireEvent.click(comp.getByText("Sink processor"));

    expect(comp.queryByText("Filters")).toBeInTheDocument();
    expect(comp.getAllByTestId("filter-item").length).toBe(1);
    expect(comp.getAllByLabelText("Delete filter").length).toBe(1);
    expect(comp.getByLabelText("Delete filter")).toBeDisabled();

    fireEvent.change(comp.getByLabelText("Key"), {
      target: { value: "name" },
    });
    expect(comp.getByDisplayValue("name")).toBeInTheDocument();

    fireEvent.click(comp.getByText("Add filter"));
    expect(comp.getAllByTestId("filter-item").length).toBe(2);
    expect(comp.getAllByLabelText("Delete filter")[0]).toBeEnabled();
    expect(comp.getAllByLabelText("Delete filter")[1]).toBeEnabled();

    fireEvent.change(comp.getAllByLabelText("Key")[1], {
      target: { value: "age" },
    });
    expect(comp.getByDisplayValue("age")).toBeInTheDocument();

    fireEvent.click(comp.getAllByLabelText("Delete filter")[1]);
    expect(comp.getAllByTestId("filter-item").length).toBe(1);
    expect(comp.queryByDisplayValue("age")).not.toBeInTheDocument();
    expect(comp.getByLabelText("Delete filter")).toBeDisabled();
  });

  it("displays source configuration parameters after source selection", async () => {
    const { comp } = setupProcessorEdit();
    await waitForI18n(comp);

    fireEvent.click(comp.getByText("Source processor"));

    expect(comp.queryByText("Source")).toBeInTheDocument();
    expect(comp.queryByLabelText("Source type")).toBeInTheDocument();
    expect(comp.queryByLabelText("Source type")).toBeEnabled();
    expect(comp.queryByLabelText("Source configuration")).toBeInTheDocument();
    expect(comp.getByLabelText("Source configuration")).toBeDisabled();
    fireEvent.change(comp.getByLabelText("Source type"), {
      target: { value: "Slack" },
    });

    expect(
      (comp.getByLabelText("Source type") as HTMLSelectElement).value
    ).toBe("Slack");

    expect(comp.getByLabelText("Channel *")).toBeEnabled();
    expect(comp.getByLabelText("Token *")).toBeEnabled();
  });

  it("displays action configuration parameters after action selection", async () => {
    const { comp } = setupProcessorEdit();
    await waitForI18n(comp);

    fireEvent.click(comp.getByText("Sink processor"));

    expect(comp.queryByText("Action")).toBeInTheDocument();
    expect(comp.queryByLabelText("Action type")).toBeInTheDocument();
    expect(comp.queryByLabelText("Action type")).toBeEnabled();
    expect(comp.queryByLabelText("Action configuration")).toBeInTheDocument();
    expect(comp.getByLabelText("Action configuration")).toBeDisabled();
    fireEvent.change(comp.getByLabelText("Action type"), {
      target: { value: "KafkaTopic" },
    });

    expect(
      (comp.getByLabelText("Action type") as HTMLSelectElement).value
    ).toBe("KafkaTopic");

    expect(
      comp.queryByLabelText("Action configuration")
    ).not.toBeInTheDocument();

    expect(comp.queryByLabelText("Kafka Topic *")).toBeInTheDocument();
    expect(comp.getByLabelText("Kafka Topic *")).toBeEnabled();
  });
});
