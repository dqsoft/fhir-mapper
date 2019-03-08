const { buildMappers } = require('../mapper');

const applyProfile = (resource, profile) => {
    if (profile) {
        resource.meta = resource.meta || {};
        resource.meta.profile = resource.meta.profile || [];
        resource.meta.profile.unshift(profile); // ensure this profile is first in the list
    }
    return resource;
};

const DEFAULT_PROFILE = {
    'Patient': 'http://hl7.org/fhir/us/fhirURL/StructureDefinition/shr-entity-Patient',
    'Observation': 'http://hl7.org/fhir/us/fhirURL/StructureDefinition/shr-base-Observation', // TODO: see also NonLaboratoryObservation & descendents, LaboratoryObservation, etc????
    'Encounter': 'http://hl7.org/fhir/us/fhirURL/StructureDefinition/shr-encounter-Encounter',
    '': '',

    // below are TODO
    'Condition': 'http://example.com/shr-base-ConditionPresentAssertion',
    'Procedure': 'http://example.com/shr-procedure-ProcedurePerformed',
    'Organization': 'shr-entity-Organization',
    'Practitioner': 'shr-entity-Practitioner', // ?
    // 'MedicationRequest': 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-medicationrequest', // TODO: this is a us-core so there's no ES6 object for it... MedicationRequested?

    // no mappings for any of these
    // 'DiagnosticReport': '', // note: Panel is based on Observation
    // 'Claim': '',
    // 'ExplanationOfBenefit': '',
    // 'CarePlan': '',
    // 'Goal': '',
    // 'Immunization': '',
};

const resourceMapping = {
    filter: () => true,
    default: (resource) => applyProfile(resource, DEFAULT_PROFILE[resource.resourceType]),
    mappers: [
        {
            filter: "Condition.code.coding.where($this.code = '93761005' or $this.code = '94260004')",
            exec: (resource) => applyProfile(resource, 'http://hl7.org/fhir/us/fhirURL/StructureDefinition/oncocore-CancerDisorderPresent')
        },
        {
            filter: "Procedure.code.coding.where($this.code = '703423002')",
            exec: (resource) => applyProfile(resource, 'http://hl7.org/fhir/us/fhirURL/StructureDefinition/oncocore-RadiationProcedurePerformed')
        }
    ]
};

module.exports = buildMappers(resourceMapping);